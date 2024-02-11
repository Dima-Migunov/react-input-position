import githubLogo from './github-logo.png'
import npmLogo from './npm-logo.png'

export default function Header() {
    return (
        <header className='header'>
            <div className='header-wrapper'>
                <div className='brand'>
                    <h1>ReactInputPosition V2 (Typescript)</h1>
                </div>

                <div className='logos'>
                    <a href='https://github.com/Dima-Migunov/react-image-magnifiers'>
                        <img src={githubLogo} alt='Github Logo' />
                    </a>
                    <a href='https://www.npmjs.com/package/react-input-position'>
                        <img src={npmLogo} alt='NPM Logo' />
                    </a>
                </div>
            </div>
        </header>
    )
}
