interface Props {
   handlerSubmit:(event:React.FormEvent<HTMLFormElement>)=>void
  }
const Tipo = (props:Props) => {
   return (
      <section className="parametro-section">
         <form onSubmit={props.handlerSubmit}> 
            <label className="parametros-label" htmlFor="tipo">Qual é o novo tipo?</label>
            <input name='tipo' className="parametros-input"  type="text"  />
            <input name="destino" value={'tipo'} type="hidden"/>
            <button className="parametros-btn" >Cadastrar novo tipo</button>
         </form>
      </section>
   )
}


export default Tipo