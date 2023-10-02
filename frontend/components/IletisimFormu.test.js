import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import App from './../App';
import IletisimFormu from './IletisimFormu';

const passingData = {
    name: 'Mesud',
    surname : 'AYDIN',
    email : 'eem.mesud.28@gmail.com',
    message: 'bir seyler yaz'
};

const failingData = {
    name: 'Mes',
    surname : 'AY',
    email : 'mesud_gmail.com',
    message: ''
}


test('hata olmadan render ediliyor', async() => {
     render(<App/>);
     const linkHead = screen.getByText(/Entegrasyon Test Projesi/i);
     expect(linkHead).toBeInTheDocument();
});

describe('iletişim formu', () => {
    beforeEach(() => {
        render(<IletisimFormu/>);
    })

test('iletişim formu headerı render ediliyor', () => {
    const baslikForm = screen.getByText('İletişim Formu');
    expect(baslikForm).toBeInTheDocument();
});
test('Form içinde 4 adet input bulunuyor mu ',() => {
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(4);
});
test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    const nameInput = screen.getByPlaceholderText(/İlhan/i);
    userEvent.type(nameInput, failingData.name);
    const nameMesaj = await screen.findByText(/Ad en az 5 karakter olmalı/i);
    expect(nameMesaj).toBeInTheDocument();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    userEvent.click(screen.getByText(/Gönder/i));
    await waitFor(() => {
        const errorMessages = screen.getAllByTestId('error');
        expect(errorMessages.length).toBe(3);
    })
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    const userName = screen.getByPlaceholderText(/İlhan/i);
    const userSurname = screen.getByPlaceholderText(/Mansız/i);
    // const userEmail = screen.getAllByPlaceholderText('yüzyılıngolcüsü@hotmail.com');
    userEvent.type(userName, passingData.name);
    userEvent.type(userSurname, passingData.surname);
    userEvent.click(screen.getByText(/Gönder/i));
    await waitFor(() => {
        const errMessage = screen.getAllByTestId('error');
        expect(errMessage.length).toBe(1);
    })

});
test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    const userEmailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
    userEvent.type(userEmailInput,failingData.email);
    await waitFor(() => {
      expect(
        screen.queryByText(/email geçerli bir email adresi olmalıdır./i)
        ).toBeInTheDocument();
    })
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    const userName = screen.getByPlaceholderText(/İlhan/i);
    const userEmailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
    userEvent.type(userName,passingData.name);
    userEvent.type(userEmailInput,passingData.email);
    userEvent.click(screen.getByText(/Gönder/i));

    await waitFor(() => {
        expect(
            screen.queryByText(/soyad gereklidir./i)
        ).toBeInTheDocument();
    })
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    const userName = screen.getByPlaceholderText(/İlhan/i);
    const userSurname = screen.getByPlaceholderText(/Mansız/i);
    const userEmailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
    userEvent.type(userName,passingData.name);
    userEvent.type(userSurname,passingData.surname);
    userEvent.type(userEmailInput,passingData.email);
    userEvent.click(screen.getByText(/Gönder/i));

    await waitFor(() => {
        expect(screen.getByTestId(/firstnameDisplay/i).textContent).toBe(`Ad: ${passingData.name}`);
        expect(screen.getByTestId(/lastnameDisplay/i).textContent).toBe(`Soyad: ${passingData.surname}`);
        expect(screen.getByTestId(/emailDisplay/i).textContent).toBe(`Email: ${passingData.email}`);
        expect(screen.queryAllByTestId("messageDisplay")).toHaveLength(0);
    })
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    const userName = screen.getByPlaceholderText(/İlhan/i);
    const userSurname = screen.getByPlaceholderText(/Mansız/i);
    const userEmailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
    const userComment = screen.getByTestId(/message/i);
    userEvent.type(userName,passingData.name);
    userEvent.type(userSurname,passingData.surname);
    userEvent.type(userEmailInput,passingData.email);
    userEvent.type(userComment,passingData.message);
    userEvent.click(screen.getByText(/Gönder/i));

    await waitFor(() => {
        expect(screen.getByTestId(/firstnameDisplay/i).textContent).toBe(`Ad: ${passingData.name}`);
        expect(screen.getByTestId(/lastnameDisplay/i).textContent).toBe(`Soyad: ${passingData.surname}`);
        expect(screen.getByTestId(/emailDisplay/i).textContent).toBe(`Email: ${passingData.email}`);
        expect(screen.getByTestId(/messageDisplay/i).textContent).toBe(`Mesaj: ${passingData.message}`);
        
    })
});

});
