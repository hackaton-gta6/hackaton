type Props = { value: string; onChange: (value: string) => void; disabled?: boolean };

export function PinPad({ value, onChange, disabled = false }: Props) {
  const press = (key: string) => {
    if (disabled) return;
    if (key === '⌫') onChange(value.slice(0, -1));
    else if (value.length < 4) onChange(value + key);
  };
  return <div className="pin-pad" aria-label="Teclado del PIN">
    {['1','2','3','4','5','6','7','8','9','', '0','⌫'].map((key, index) => key
      ? <button className="pin-key" type="button" key={key} disabled={disabled} onClick={() => press(key)}>{key}</button>
      : <span key={index} />)}
  </div>;
}