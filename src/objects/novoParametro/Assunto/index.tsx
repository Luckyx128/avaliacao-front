interface Props {
 handlerSubmit:(event:React.FormEvent<HTMLFormElement>)=>void
}


const Assunto = (props:Props) => {
   return (
      <section className="parametro-section">
         <form onSubmit={props.handlerSubmit}>
            <label className="parametro-label" htmlFor="assunto">Qual é o novo assunto?</label>
            <input name="assunto" className="parametro-input" type="text"  />
            <input name="destino" value={'assunto'} type="hidden"/>
            <button className="parametro-btn">Cadastrar novo assunto</button>
         </form>
      </section>
   )
}


export default Assunto