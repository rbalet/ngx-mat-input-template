/// <reference types="vitest/globals" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { MatCustomInputComponent } from './ngx-mat-custom-input-template';

describe('MatCustomInputComponent', () => {
  let component: MatCustomInputComponent;
  let fixture: ComponentFixture<MatCustomInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCustomInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatCustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.controlType).toBe('ngx-mat-custom-input');
  });

  it('should compute empty and shouldLabelFloat from value and focus state', () => {
    component.writeValue(null);
    component.focused = false;
    expect(component.empty).toBe(true);
    expect(component.shouldLabelFloat).toBe(false);

    component.focused = true;
    expect(component.shouldLabelFloat).toBe(true);

    component.focused = false;
    component.writeValue('abc');
    expect(component.empty).toBe(false);
    expect(component.shouldLabelFloat).toBe(true);
  });

  it('should propagate input values through ControlValueAccessor callback', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'my value';
    input.dispatchEvent(new Event('input'));

    expect(component.value).toBe('my value');
    expect(onChange).toHaveBeenCalledWith('my value');
  });

  it('should support disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(component.disabled).toBe(true);
    expect(input.disabled).toBe(true);
  });

  it('should set describedBy ids and preserve user aria-describedby', () => {
    component.userAriaDescribedBy = 'custom-id';
    component.setDescribedByIds(['hint-1', 'error-2']);

    expect(component.describedBy).toBe('hint-1 error-2 custom-id');
  });

  it('should focus input when container click is outside input', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');
    const target = document.createElement('div');

    component.onContainerClick({ target } as unknown as MouseEvent);

    expect(focusSpy).toHaveBeenCalled();
  });
});
