import React, { useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ProductForm = () => {
    const prods = JSON.parse(localStorage.getItem('products')) || [];
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [id, setId] = useState(prods.length + 1);
    const [category, setCategory] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [contactDetails, setContactDetails] = useState('');
    const [products, setProducts] = useState(prods);
    const [isRecording, setIsRecording] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleProductNameChange = (e) => setProductName(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleImageChange = (e) => setImage(e.target.files[0]);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleSellerNameChange = (e) => setSellerName(e.target.value);
    const handleContactDetailsChange = (e) => setContactDetails(e.target.value);
    const handleLatitudeChange = (e) => setLatitude(e.target.value);
    const handleLongitudeChange = (e) => setLongitude(e.target.value);

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                    toast.success('Location fetched successfully!');
                },
                (error) => {
                    toast.error('Error getting location: ' + error.message);
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                chunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
                await processAudioInput(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            toast.info('Recording started...');
        } catch (err) {
            toast.error('Error accessing microphone');
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            toast.info('Recording stopped. Processing audio...');
        }
    };

    const processAudioInput = async (audioBlob) => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
    
            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];
    
                const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
                const result = await model.generateContent({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: `Extract product information (if info not given make best judgement and fill the json hardcode it basically lol) from this audio using this JSON schema:
                                Product = {
                                    "productName": string,
                                    "description": string,
                                    "price": string,
                                    "category": string but can only be from ["tools", "clothes", "sports", "furniture", "other"] ,
                                    "sellerName": string,
                                    "contactDetails": string
                                }` },
                                {
                                    inlineData: {
                                        mimeType: "audio/mp3",
                                        data: base64Audio,
                                    },
                                },
                            ],
                        },
                    ],
                });
    
                let responseText = result.response.text();
                responseText = responseText.replace(/```json|```/g, '').trim();
                const productData = JSON.parse(responseText);
    
                setProductName(productData.productName || '');
                setDescription(productData.description || '');
                setPrice(productData.price || '');
                setCategory(productData.category || '');
                setSellerName(productData.sellerName || '');
                setContactDetails(productData.contactDetails || '');
    
                toast.success('Voice input processed successfully!');
            };
    
            reader.onerror = (error) => {
                toast.error('Error reading audio file');
                console.error(error);
            };
        } catch (error) {
            toast.error('Error processing voice input');
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        if (!productName.trim()) errors.productName = 'Product Name is required';
        if (!description.trim()) errors.description = 'Description is required';
        if (!price.trim()) errors.price = 'Price is required';
        if (!category.trim()) errors.category = 'Category is required';
        if (!image) errors.image = 'Image is required';
        if (!sellerName.trim()) errors.sellerName = 'Seller Name is required';
        if (!contactDetails.trim()) errors.contactDetails = 'Contact Details are required';
        if (!latitude.trim() || !longitude.trim()) errors.location = 'Location is required';

        if (Object.keys(errors).length === 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const product = {
                    id,
                    productName,
                    description,
                    price,
                    image: reader.result,
                    quantity: 1,
                    category,
                    sellerName,
                    contactDetails,
                    location: {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude)
                    }
                };

                const updatedProducts = [...products, product];
                localStorage.setItem('products', JSON.stringify(updatedProducts));
                setProducts(updatedProducts);
                setId(id + 1);

                setProductName('');
                setDescription('');
                setPrice('');
                setImage(null);
                setCategory('');
                setSellerName('');
                setContactDetails('');
                setLatitude('');
                setLongitude('');

                toast.success('Product added successfully');
            };

            reader.readAsDataURL(image);
        } else {
            Object.values(errors).forEach((error) => toast.error(error));
        }
    };

    return (
        <div className="container" style={{ width: '70%' }}>
            <h2>Add Product</h2>
            <div className="voice-controls mb-4">
                <button 
                    type="button" 
                    className={`btn ${isRecording ? 'btn-danger' : 'btn-success'} me-2`}
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                {isRecording && (
                    <span className="text-danger">Recording in progress...</span>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        value={productName}
                        onChange={handleProductNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="price"
                        value={price}
                        onChange={handlePriceChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        className="form-control"
                        id="category"
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select a category</option>
                        <option value="tools">Tools</option>
                        <option value="clothes">Clothing</option>
                        <option value="sports">Sports</option>
                        <option value="furniture">Furniture</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="sellerName">Seller Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="sellerName"
                        value={sellerName}
                        onChange={handleSellerNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contactDetails">Contact Details:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="contactDetails"
                        value={contactDetails}
                        onChange={handleContactDetailsChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Location:</label>
                    <div className="row">
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Latitude"
                                value={latitude}
                                onChange={handleLatitudeChange}
                            />
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Longitude"
                                value={longitude}
                                onChange={handleLongitudeChange}
                            />
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={getCurrentLocation}
                            >
                                Get Current Location
                            </button>
                        </div>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        className="form-control-file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProductForm;