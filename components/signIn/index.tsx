import React, {createRef, FormEvent} from 'react';

interface ISignInFormState {
    name: string;
    password: string;
}

interface ISignInFormProps {
    handleSubmit(name: any, password: string): void;
}

export default class SignUp extends React.Component<ISignInFormProps, ISignInFormState> {
    nameRef = createRef<HTMLInputElement>();

    passwordRef = createRef<HTMLInputElement>();

    render() {
        return (
            <form className='search-form' id='search-form'>
                <input
                    ref={this.nameRef}
                    autoComplete='off'
                    className='auth-input'
                    pattern='[a-zA-Z0-9\-]{3,}'
                    placeholder='Логин'
                    required
                    type='text'
                />
                <input
                    ref={this.passwordRef}
                    autoComplete='off'
                    className='auth-input'
                    placeholder='Пароль'
                    required
                    type='password'
                />
                <button
                    id='link-button'
                    className='link-button auth'
                    onClick={(e: FormEvent<any>) => {
                        e.preventDefault();
                        this.props.handleSubmit(
                            this.nameRef.current!.value,
                            this.passwordRef.current!.value
                        );
                    }}
                >
                    Войти
                </button>
            </form>
        );
    }
}
