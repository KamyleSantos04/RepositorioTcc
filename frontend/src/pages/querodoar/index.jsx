import './index.scss'

export default function QueroDoar(){
    return(
        <section className='verde'>
      <div className='logo'>
      <img src='./assets/images/logobranca.png' alt='logo' width={130}/>
      </div>

      <div className='icons'>
     <img src='./assets/icons/inicio.png' alt='inicio' width={15}></img>
     <img src='./assets/icons/minhaconta.png' alt='conta' width={15}></img>
     <img src='./assets/icons/querodoar.png' alt='doar' width={15}></img>
     <div className="sair"><img src='./assets/icons/sair.png' alt='sair' width={15}></img></div>
      </div>
         </section>
    )
};