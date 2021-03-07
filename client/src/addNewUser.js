import React, { useEffect } from 'react';
import { Form, Input, Button, Select , message} from 'antd'; const { Option } = Select;
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, HomeOutlined, WalletOutlined , EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';
import '../styles/main.scss';
import { saveNewUser , saveFormInput , resetFormData} from './redux/actions';

function mapStateToProps(state) {
    return {
        userFormData: state.userReducer.userFormData,
        newUserMessage: state.userReducer.newUserMessage,
    };
}

const AddNewUser = ({ dispatch , userFormData , newUserMessage }) => {
    const key = 'updatable';

    useEffect(()=> {
        if(!newUserMessage.message) return;
        newUserMessage.type === 'error' && message.error({ content: newUserMessage.message, key, duration: 2 });
        newUserMessage.type === 'success' && message.success({ content: newUserMessage.message, key, duration: 2 });
        newUserMessage.type === 'success' && dispatch(resetFormData());
    } , [newUserMessage.message]);

    function onInputHandler(target) {
        const newUserFormData = JSON.parse(JSON.stringify(userFormData));
        typeof target === 'string' && (newUserFormData['role'] = target);
        target.dataset && (target.dataset.address ? newUserFormData.address[target.id] = target.value : newUserFormData[target.id] = target.value);
        dispatch(saveFormInput(newUserFormData));
    }  

    function onSubmit() {
        message.loading({ content: 'שולח...', key });
        dispatch(saveNewUser());
    }

    const fields = [];
    Object.keys(userFormData).map(key => {
        key!=='address' && fields.push({name : [key] , value: userFormData[key]});
        key === 'address' && Object.keys(userFormData[key]).map(addressKey=> fields.push({name : [addressKey] , value: userFormData[key][addressKey]}));
    });

    return (
        <div className="form-container">
            <Form fields={fields} onInput={(e)=>onInputHandler(e.target)} onFinish={onSubmit} dir="rtl" className="form">
                <Form.Item name="firstName" rules={[{ required: true, message: 'בבקשה הכנס שם פרטי!',},]}>
                    <Input id="firstName" prefix={<UserOutlined/>} placeholder="שם פרטי"/>
                </Form.Item>
                <Form.Item name="lastName" rules={[{ required: true, message: 'בבקשה הכנס שם משפחה!', },]}>
                    <Input id="lastName" prefix={<UserOutlined/>} type="text" placeholder="שם משפחה"/>
                </Form.Item>
                <Form.Item name="userName" rules={[{ required: true, message: 'בבקשה הכנס שם משתמש!', },]}>
                    <Input id="userName" prefix={<UserOutlined/>} type="text" placeholder="שם משתמש"/>
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'בבקשה הכנס כתובת מייל!', },{ type: 'email', message: 'מייל לא תקין!',},]}>
                    <Input id="email" prefix={<MailOutlined/>} type="text" placeholder="כתובת מייל"/>
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'בבקשה הכנס סיסמא!', }, { min: 8, message: 'הסיסמא צריכה להיות באורך 8 תווים לפחות!', }]} >
                    <Input id="password" prefix={<LockOutlined/>} type="password" placeholder="סיסמא" value={userFormData.password}/>
                </Form.Item>
                <Form.Item name="phoneNumber" rules={[{ required: true, message: 'בבקשה הכנס מספר טלפון!', },
                                                    { pattern: /^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, message: "מספר הטלפון לא תקין" }
                                                    ]}>
                    <Input id="phoneNumber" prefix={<PhoneOutlined/>} type="text" placeholder="טלפון"/>
                </Form.Item>
                <Form.Item name="city" rules={[{ required: true, message: 'בבקשה הכנס עיר!', },]}>
                    <Input id="city" prefix={<GlobalOutlined/>} data-address={true} type="text" placeholder="  עיר"/>
                </Form.Item>
                <Form.Item name="street" rules={[{ required: true, message: 'בבקשה הכנס רחוב !', },]}>
                    <Input id="street" prefix={<HomeOutlined/>} data-address={true} type="text" placeholder="רחוב"/>
                </Form.Item>
                <Form.Item name="houseNumber" rules={[{ required: true, message: 'בבקשה הכנס מספר בית !', },]}>
                    <Input id="houseNumber" prefix={<WalletOutlined/>} data-address={true} type="number" placeholder="מספר בית"/>
                </Form.Item>
                <Form.Item name="role" rules={[{ required: true, message: 'בבקשה בחר תפקיד !', },]}>
                    <Select onSelect={(value)=>onInputHandler(value)} id="role" placeholder="תפקיד" suffixIcon={<EditOutlined style={{color: '#262626',fontSize: 'medium' , marginRight: '4px'}}/>}>
                        <Option value="מנהל" dir ="rtl">מנהל</Option>
                        <Option value="מורה" dir ="rtl">מורה</Option>
                        <Option value="תלמיד" dir ="rtl">תלמיד</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">שלח</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="button" onClick={()=>dispatch(resetFormData())}>אפס טופס</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default connect(mapStateToProps)(AddNewUser);