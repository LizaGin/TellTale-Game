import React, {createRef, FormEvent} from 'react';

interface ISignUpFormState {
    picture: string;
    disabled: boolean;
}

interface ISignUpFormProps {
    handleSubmit(name: any, password: string, picture: string): void;
}

export default class SignUp extends React.Component<ISignUpFormProps, ISignUpFormState> {
    state: ISignUpFormState = {
        picture: '',
        disabled: true
    };

    nameRef = createRef<HTMLInputElement>();

    passwordRef = createRef<HTMLInputElement>();

    fileRef = createRef<HTMLInputElement>();

    inputChange = () => {
        const name = this.nameRef.current!.value || '';
        const pwd = this.passwordRef.current!.value || '';

        const isCorrectName = /[a-zA-Z0-9|-]/.test(name);

        if(isCorrectName && pwd){
            this.setState({disabled: false});
        }
    }

    encodeImageFileAsUrl = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => this.setState({picture: reader.result as string});
        reader.readAsDataURL(file);
    }

    onFileInputChange = () => {
        const file = this.fileRef.current!.files![0];
        this.encodeImageFileAsUrl(file);

    }

    render() {
        return (
            <form className='search-form' id='search-form'>
                <input
                    ref={this.nameRef}
                    onChange={this.inputChange}
                    autoComplete='off'
                    className='auth-input'
                    pattern='[a-zA-Z0-9\-]+'
                    placeholder='Логин'
                    required
                    type='text'
                />
                <input
                    ref={this.passwordRef}
                    onChange={this.inputChange}
                    autoComplete='off'
                    className='auth-input'
                    placeholder='Пароль'
                    required
                    type='password'
                />
                <input
                    className='auth-input'
                    id='auth-input'
                    type='file'
                    accept='.jpeg,.jpg,.png'
                    ref={this.fileRef}
                    onChange={this.onFileInputChange}
                />
                <button
                    id='link-button'
                    className='link-button auth'
                    disabled={this.state.disabled}
                    onClick={(e: FormEvent<any>) => {
                        e.preventDefault();
                        this.props.handleSubmit(
                            this.nameRef.current!.value,
                            this.passwordRef.current!.value,
                            this.state.picture
                        );
                    }}
                >
                    Зарегистрироваться и Войти
                </button>
            </form>
        );
    }
}
