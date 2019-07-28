import React from 'react';
import classnames from 'classnames';

const TextAreaGroup = ({
  classname,
  divClassname,
  name, 
  rows,
  placeholder,
  readonly,
  value,
  error,
  info,
  onChange,
  style,
  id
}) => {
  return (
    <div className={divClassname}>
      <textarea
        className={classnames(classname, {
          'is-invalid': error
        })}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={style}
        id={id}
        readOnly={readonly}
      />
      {info && <small className='form-text text-muted'>{info}</small>}
      {error && (
        <div className='invalid-feedback'>{error}</div>
      )}
    </div>
  )
}

TextAreaGroup.defaultProps = {
  classname: 'form-control',
  divClassname: 'form-group',
  onChange: null
}

export default TextAreaGroup;
