'use client';

import { useState } from 'react';
import { profileService } from '../../../services/profile.service.ts';
import { formStyles } from '../../common/FormStyles.tsx';

export function Profile() {
    const user = profileService.getUser();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullname: user.fullname,
        phone: user.phone,
        address: user.address,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await profileService.update(user.id, formData);
            alert('Changes saved successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error saving changes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullname: user.fullname,
            phone: user.phone,
            address: user.address,
        });
    };

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        My Profile
                    </h1>
                    <div className={formStyles.buttonContainer}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={formStyles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="profile-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form id="profile-form" onSubmit={handleSubmit} className={formStyles.form}>
                        <div className={formStyles.fieldGrid}>
                            {/* Full Name */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="fullname" className={formStyles.label}>
                                    Full Name <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className={formStyles.input}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="email" className={formStyles.label}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    className={formStyles.disabledInput}
                                    disabled
                                />
                            </div>

                            {/* Phone */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="phone" className={formStyles.label}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Your phone number"
                                    className={formStyles.input}
                                />
                            </div>

                            {/* Shipping Address */}
                            <div className={formStyles.fullWidthField}>
                                <label htmlFor="address" className={formStyles.label}>
                                    Shipping Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Your complete address"
                                    className={formStyles.input}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
