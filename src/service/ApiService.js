// Import axios to make HTTP requests (GET, POST, etc.)
import axios from "axios";

// Import CryptoJS library to encrypt and decrypt data
import CryptoJS from "crypto-js";

// Create a class to handle API related operations
export default class ApiService {

    // Base URL of your Spring Boot backend
    static BASE_URL = "http://localhost:8080/api";

    // Secret key used for encryption & decryption
    static ENCRYPTION_KEY = "ananya-secret-key";

    // Converts readable token → unreadable string.
    static encrypt(token) {

        // AES encryption using secret key
        return CryptoJS.AES.encrypt(
            token,
            this.ENCRYPTION_KEY
        ).toString(); // convert to string format
    }

    // Converts encrypted token → original token. Used before sending to backend.
    static decrypt(token) {

        // Decrypt using same secret key
        const bytes = CryptoJS.AES.decrypt(
            token,
            this.ENCRYPTION_KEY
        );

        // Convert decrypted bytes into readable string
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // save token
    static saveToken(token)
    {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem("token", encryptedToken); //token → encrypt → store in localStorage
    }

    // retrieve token
    static getToken()
    {
        // read encrypted token → decrypt → return real token
        const encryptedToken = localStorage.getItem("token");
        if(!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }

    // save role
    static saveRole(role)
    {
        const encryptedRole = this.encrypt(role);
        localStorage.setItem("role", encryptedRole);
    }

    // get role
    static getRole()
    {
        const encryptedRole = localStorage.getItem("role");
        if(!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    static clearAuth()
    {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static getHeader()
    {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }

    /*AUTH AND USERS API METHODS */
    // AUTH
    static async registerUser(registrationData)
    {
        const resp = await axios.post(`${this.BASE_URL}/auth/register`, registrationData);
        return resp.data;
    }

    static async loginUser(loginData)
    {
        const resp = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
        return resp.data;
    }

    // USERS
    static async myProfile()
    {
        const resp = await axios.get(`${this.BASE_URL}/users/account`, {
            headers: this.getHeader()
        })
        return resp.data;
    }

    static async myBookings()
    {
        const resp = await axios.get(`${this.BASE_URL}/users/bookings`, {
            headers: this.getHeader()
        })
        return resp.data;
    }

    static async deleteAccount()
    {
        const resp = await axios.delete(`${this.BASE_URL}/users/delete`, {
            headers: this.getHeader()
        })
        return resp.data;
    }

    // ROOMS
    static async addRoom(formData)
    {
        const resp = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return resp.data;
    }

    // To get Room types
    static async getRoomTypes()
    {
        const resp = await axios.get(`${this.BASE_URL}/rooms/types`)
        return resp.data;
    }

    // To get all rooms
    static async getAllRooms()
    {
        const resp = await axios.get(`${this.BASE_URL}/rooms/all`)
        return resp.data;
    }

    // To get room deatils
    static async getRoomById(roomId)
    {
        const resp = await axios.get(`${this.BASE_URL}/rooms/${roomId}`)
        return resp.data;
    }

    // To delete room by id
    static async deleteRoomById(roomId)
    {
        const resp = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
            headers: this.getHeader()
        })
        return resp.data;
    }

    // UPDATE ROOMS
    static async updateRoom(formData)
    {
        const resp = await axios.put(`${this.BASE_URL}/rooms/update`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return resp.data;
    }

    static async getAvailableRooms(checkInDate, checkOutDate, roomType)
    {
        const resp = await axios.get(`${this.BASE_URL}/rooms/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`);
        return resp.data;
    }

    static async bookRoom(booking)
    {
        const resp = await axios.post(`${this.BASE_URL}/bookings`, booking, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async getAllBookings()
    {
        const resp = await axios.get(`${this.BASE_URL}/bookings/all`, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async updateBooking(booking)
    {
        const resp = await axios.put(`${this.BASE_URL}/bookings/update`, booking, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    // Find booking by reference code
    static async getBookingByReference(reference) {
        const resp = await axios.get(
            `${this.BASE_URL}/bookings/${reference}`
        );
        return resp.data;
    }


    // PAYMENT
    // Function to create payment intent
    static async proceedForPayment(body)
    {
        const resp = await axios.post(`${this.BASE_URL}/payment/pay`, body, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async updatePayment(body)
    {
        const resp = await axios.put(`${this.BASE_URL}/payment/update`, body, {
            headers: this.getHeader()
        });
        return resp.data;
    }


    // AUTHENTICATION CHECKER
    static logout()
    {
        this.clearAuth();
    }

    static isAuthenticated()
    {
        const token =  this.getToken();
        return !!token;
    }

    static isAdmin()
    {
        const role =  this.getRole();
        return role==="ADMIN";
    }

    static isCustomer()
    {
        const role =  this.getRole();
        return role==="CUSTOMER";
    }

    //guard services are method to protect API routes
}
