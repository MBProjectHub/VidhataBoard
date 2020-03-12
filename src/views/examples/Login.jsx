import React from "react";

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col
} from "reactstrap";

import fire from 'firebase'

import CircularProgress from '@material-ui/core/CircularProgress';
class Login extends React.Component {

    state = {
        loading: false,
        passcode: null
    }

    componentDidMount() {
        fire.database().ref('passcode').on('value', (passcode) => {
            this.setState({passcode: passcode.val()})
        })
    }

    firebaseLogin() {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let passcode = document.getElementById('passcode').value;

        if (passcode !== null && passcode === this.state.passcode + "") {
            if (email.length !== 0 && password.length !== 0) {
                fire.database().ref('users').orderByChild('email').equalTo(email).once('value').then((res) => {
                    if (res.val()) {
                        if (res.val()[Object.keys(res.val())[0]]['admin']) {
                            fire.auth().signInWithEmailAndPassword(email, password).then(() => {
                                this.props.history.push('/admin/bookings')
                                console.log(fire.auth().currentUser.uid)
                            }).catch(() => {
                                this.setState({loading: false})
                                alert('Wrong credentials')
                            })
                        } else {
                            alert('You are not registerd as an admin')
                        }
                        this.setState({loading: false})
                    } else {
                        alert('Email not registered.')
                        this.setState({loading: false})
                    }
                })
            } else {
                this.setState({loading: false})
                alert("Please enter all the details");
            }
        } else {
            this.setState({loading: false})
            alert("Incorrect Passcode");
        }

    }
    renderLoader() {
        if (this.state.loading) 
            return <CircularProgress/>

         else 
            return <Button className="mt-4" color="primary" type="button"
                onClick={
                    () => {
                        this.setState({
                            loading: true
                        }, this.firebaseLogin.bind(this))
                    }
            }>
                Sign In
            </Button>


        


    }


    render() {
        return (
            <>
                <Col lg="5" md="7">
                    <Card className="bg-secondary shadow border-0">

                        <CardBody className="px-lg-5 py-lg-5">
                            <Form role="form">
                                <FormGroup>
                                    <InputGroup className="input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-key-25"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="passcode" placeholder="Passcode"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-email-83"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="email" placeholder="Email" type="email"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-lock-circle-open"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="password" placeholder="Password" type="password"/>
                                    </InputGroup>
                                </FormGroup>

                            </Form>
                            {
                            this.renderLoader()
                        } </CardBody>
                    </Card>

                </Col>
            </>
        );
    }
}
export default Login;
