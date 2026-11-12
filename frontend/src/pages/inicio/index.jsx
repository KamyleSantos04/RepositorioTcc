import './index.scss'
import { Link, useNavigate } from 'react-router-dom'
import {
    lerSessao,
    rotaLogin,
    rotaPorOrigem,
    tipoPorOrigem
} from '../../lib/sessao'

export default function Inicio() {
  const navegar = useNavigate()

  function escolher(origem) {
    const destino = rotaPorOrigem(origem)
    const sessao = lerSessao()

    if (sessao && sessao.tipo === tipoPorOrigem(origem)) {
      navegar(destino)
      return
    }

    navegar(rotaLogin(destino, origem))
  }

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

        <button
          type='button'
          className='doar'
          onClick={() => escolher('doar')}
        >
          Quero doar
        </button>

        <button
          type='button'
          className='doardois'
          onClick={() => escolher('receber')}
        >
          Preciso de alimentos
        </button>

      </section>

      <div className='bege'>
  <div className='item'>
    <img src='./assets/images/folha.png' alt='' width={150} />
    <p>Conecta estabelecimentos e instituições</p>
  </div>

  <div className='item'>
    <img src='./assets/images/maca.png' alt='' width={150} />
    <p>Combate a fome e o desperdício</p>
  </div>

  <div className='item'>
    <img src='./assets/images/pessoas.png' alt='' width={150} />
    <p>Fortalece a comunidade</p>
  </div>
</div>

    </div>
  );
}
