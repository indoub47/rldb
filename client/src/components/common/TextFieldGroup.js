import React from 'react';
import classnames from 'classnames';

const TextFieldGroup = ({
  type, 
  id,
  label,
  name, 
  placeholder,
  value,
  error,
  info,
  onChange,
  disabled,
  readonly,
  autoComplete,
  classname,
  divClassname
}) => {
  return (
    <div className={divClassname}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        className={classnames(classname, {
          'is-invalid': error
        })}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readonly}
      />
      {info && 
      <small className='form-text text-muted'>{info}</small>}
      {error &&
      <div className='invalid-feedback'>{error}</div>}
    </div>
  )
}

TextFieldGroup.defaultProps = {
  type: 'text', 
  autoComplete: "on",
  classname: 'form-control',
  divClassname: 'form-group',
  onChange: null
}

export default TextFieldGroup;
