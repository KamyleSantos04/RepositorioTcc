
import './index.scss'
import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <div className="principal">
      
      <section className='cima'>
        <img className="logo" src='./assets/images/logo.png' alt='' width={110}></img>

        <Link className='ini' to="/">Início</Link>
        <Link to="/ComoFunciona">Como funciona</Link>
        <Link to="/Doacoes">Doações</Link>
        <Link to="/Instituicoes">Instituições</Link>

        <Link to='/Entrar'>
          <button className='um'>Entrar</button>
        </Link>

        <Link to='/Criar'>
          <button className='dois'>Criar conta</button>
        </Link>
      </section>  

      <div className="maior">
        <section className='texto'>
          <h1 className='menos'>
            Menos desperdício. <br/>
            <span>Mais alimento</span> <br />
            chegando a quem precisa.
          </h1>

          <p className='conectamos'>
            Conectamos estabelecimentos que possuem <br />
            excedentes alimentares a instituições <br />
            que precisam deles.
          </p>
        </section>

        <div className="foto">
          <img src='./assets/images/bonequinhos.png' alt='' width={400}></img>
        </div>
      </div>

      <section className='botoes'>

        <Link to='/Entrar?origem=doar'>
          <button className='doar'>
            Quero doar
          </button>
        </Link>

        <Link to='/Entrar?origem=receber'>
          <button className='doardois'>
            Preciso de alimentos
          </button>
        </Link>

      </section>

      <div className='bege'>
       <img src='./assets/images/bege.png' alt='' width={1300}></img>
      </div>

    </div>
  );
}
