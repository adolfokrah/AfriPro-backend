import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//import all the modules
import Login from './modules/authentication_module/views/login';
import Dashboard  from './modules/dashboard/views';
import Users from './modules/users_module/views';
import AddUsers from './modules/users_module/views/add_users';
// import Expenses from "./modules/expenses";
// import Invoices from "./modules/invoices";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import UserInfo from './modules/users_module/views/user_info';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Dashboard/>}/>
      <Route path="/users" element={<Users/>}/>
      <Route path="/users/add" element={<AddUsers/>}/>
      <Route path="/users/:id/:userType" element={<UserInfo/>}/>
      {/* <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />} /> */}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
