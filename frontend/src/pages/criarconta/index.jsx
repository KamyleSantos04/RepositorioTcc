import './index.scss'
import { Link } from 'react-router-dom'

export default function CriarConta(){
    return(
        <div className='criar'>
            <div className="titulos">
                <h1>Ainda não tem uma conta?</h1>
                <p>escolha como você quer se cadastrar:</p>
            </div>

            <Link to='/Estabelecimento'>
                <div className='blocoum'>
                <img src='./assets/icons/colunas.png' alt='' width={140}></img>
                <div className="desc">
                    <h1>Estabelecimento doador</h1>
                    <p>Restaurantes, padarias, mercados, hotéis, empresas e outros.</p>
                </div>
                 </div>
            </Link>

            <Link to='/CadastroInstituicao'>
                <div className='blocodois'>
                <img src='./assets/icons/users.png' alt='' width={140}></img>
                <div className="desc2">
                    <h1>ONG/Instituição</h1>
                    <p>Instituições socias, ONGs e projetos comunitários.</p>
                </div>
                </div>
            </Link>



       
        </div>
    )
}