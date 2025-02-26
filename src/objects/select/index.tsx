
import './style.css';
interface SelectProps {
  options: { value: string; label: string }[];
  setValue: (value: string) => void;
}

function Select(props: SelectProps) {
  return (
    <>
    <label htmlFor='staff-name'>
      Nome do Avaliado:
    </label>
    <select onChange={(event) => props.setValue(event.target.value)} id="staff-name">
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    </>
  );
}


export default Select;
