interface Props {
   handlerSubmit:(event:React.FormEvent<HTMLFormElement>)=>void
  }
const Setor = (props:Props) => {
   return (
      <section className="parametro-section">
         <form onSubmit={props.handlerSubmit}>
            <label className="parametro-label" htmlFor="setor">Qual é o novo setor?</label>
            <input name='setor' className="parametro-input" type="text"  />
            <input name="destino" value={'setor'} type="hidden"/>
            <button className="parametro-btn">Cadastrar novo setor</button>
         </form>
      </section>
   )
}


export default Setor