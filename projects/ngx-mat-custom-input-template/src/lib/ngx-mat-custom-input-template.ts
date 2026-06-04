import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-mat-custom-input',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule],
  template: `
    <input
      #input
      matInput
      type="text"
      class="custom-input"
      [id]="id + '-input'"
      [value]="value ?? ''"
      [placeholder]="placeholder"
      [required]="required"
      [disabled]="disabled"
      [attr.aria-describedby]="describedBy"
      [attr.aria-label]="ariaLabel || placeholder || 'Custom input'"
      (input)="onInput($event)"
    />
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .custom-input {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        outline: none;
        background: transparent;
        font: inherit;
        color: inherit;
      }
    `,
  ],
  providers: [{ provide: MatFormFieldControl, useExisting: MatCustomInputComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatCustomInputComponent
  implements MatFormFieldControl<string | null>, ControlValueAccessor, DoCheck, OnDestroy
{
  static nextId = 0;

  @ViewChild('input', { static: true })
  private input?: ElementRef<HTMLInputElement>;

  @HostBinding()
  id = `ngx-mat-custom-input-${MatCustomInputComponent.nextId++}`;

  @HostBinding('class.ngx-floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input()
  get value(): string | null {
    return this._value;
  }
  set value(value: string | null) {
    this._value = value;
    this.stateChanges.next();
  }
  private _value: string | null = null;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder = '';

  @Input() ariaLabel = '';

  @Input('aria-describedby') userAriaDescribedBy = '';

  private _required = false;
  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _disabled = false;
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  get empty(): boolean {
    return !this.value;
  }

  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'ngx-mat-custom-input';
  autofilled = false;
  describedBy = '';

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() private readonly parentForm: NgForm,
    @Optional() private readonly parentFormGroup: FormGroupDirective,
    @Optional() @Self() public readonly ngControl: NgControl,
  ) {
    this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (this.focused && !origin) {
        this.onTouched();
      }

      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngDoCheck(): void {
    if (!this.ngControl) {
      return;
    }

    const oldErrorState = this.errorState;
    const newErrorState = this.defaultErrorStateMatcher.isErrorState(
      this.ngControl.control,
      this.parentFormGroup || this.parentForm,
    );

    if (oldErrorState !== newErrorState) {
      this.errorState = newErrorState;
      this.stateChanges.next();
    }
  }

  writeValue(value: string | null): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = [...ids, this.userAriaDescribedBy].filter(Boolean).join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.input?.nativeElement.focus();
    }
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value || null;

    this.value = newValue;
    this.onChange(newValue);
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
