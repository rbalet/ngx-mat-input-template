# ngx-mat-custom-input-template

Reusable Angular Material custom-input starter library.

## Exported component

- `MatCustomInputComponent`
- Selector: `ngx-mat-custom-input`
- Implements `MatFormFieldControl<string | null>` and `ControlValueAccessor`

## Example usage

```html
<mat-form-field>
  <mat-label>Custom value</mat-label>
  <ngx-mat-custom-input [formControl]="control" placeholder="Type value"></ngx-mat-custom-input>
  <mat-error *ngIf="control.invalid">Invalid value</mat-error>
</mat-form-field>
```

## Build

```bash
ng build ngx-mat-custom-input-template
```

## Test

```bash
ng test ngx-mat-custom-input-template --watch=false
```
