import './style.css';
interface InputProps {
  label: string;
  id: string;
  setValue: (value: string) => void;
}

interface InputInicioProps {
  label: string;
  id: string;
  type: string;
  name: string;
}

function Input(props: InputProps) {


  return (
    <>
    <label htmlFor={props.id}>
      {props.label}
    </label>
      <input
        type="text"
        onChange={(event) => props.setValue(event.target.value)}
      />
    </>
  );
}


function InputInicio(props: InputInicioProps) {
  return (
   <>
     <label htmlFor={props.id}>
       {props.label}
     </label>
     <input
       type={props.type}
       name={props.name}
       id={props.id}
     />
   </>
  );
}


export { Input, InputInicio };
