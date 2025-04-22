interface Props {
   handlerSubmit:(event:React.FormEvent<HTMLFormElement>)=>void
  }
  
const Pergunta = (props:Props) => {
   return (
      <section className="parametro-section">
         <form onSubmit={props.handlerSubmit}>
            <label className="parametro-label" htmlFor="pergunta">Qual é a nova pergunta?</label>
            <input name="pergunta" className="parametro-input"  type="text"  />
            <input name="destino" value={'pergunta'} type="hidden"/>
            <button className="parametro-btn" >Cadastrar nova pergunta</button>
         </form>
      </section>
   )
}


export default Pergunta