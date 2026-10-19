import React, { useState } from 'react';
import EditIcon from '../icons/EditIcon';
import SaveIcon from '../icons/SaveIcon';
import DeleteIcon from "../icons/DeleteIcon";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config/config';
import { toast } from "react-toastify";
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { useNavigate } from 'react-router-dom';


const ActionButton = ({ onClick, isEditing, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors
            ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700 hover:bg-black'}`}
  >
    {isEditing ? <><SaveIcon /> Save Changes</> : <>{icon} {label}</>}
  </button>
);

const AccordionInputField = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 py-2 border-b border-gray-100 last:border-b-0">
    <label className="text-sm font-medium text-gray-700 w-1/3 mb-1 md:mb-0">{label}</label>
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={label}
      className={`w-full md:w-2/3 p-3 border rounded-lg transition duration-150 ease-in-out 
                        ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-slate-500 focus:border-slate-500'}`}
      disabled={disabled}
    />
  </div>
);



const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const email = user?.email;
  const [isEditingDetails, setIsEditingDetails] = useState(false);


  const [oldPass, setOldPass] = useState("");
  const { password, setPassword, validation } = usePasswordValidation();
  const showValidation = password.length >= 1;
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");


  const [openSection, setOpenSection] = useState('details');

  const updateUser = async () => {
    if (!firstName || !lastName) {
      toast.error("Enter all details");
      return;
    }
    if (firstName === user.firstName && lastName === user.lastName) {
      toast.info("No changes detected.");
      setIsEditingDetails(false);
      return;
    }

    try {
      const response = await axios.post(
        BASE_URL + "/profile/update",
        { firstName, lastName },
        { withCredentials: true }
      );
      toast.success("Details updated successfully");
      setUser(response?.data?.data);
      setIsEditingDetails(false);
    } catch (err) {
      toast.error("Failed to update details");
    }
  };

  const updatePassword = async () => {
    if (!oldPass || !password) {
      toast.error("Both password fields are required");
      return;
    }
    if (oldPass === password) {
      toast.error("New password must be different from the old password");
      setOldPass("");
      setPassword("");
      return;
    }

    if (Object.values(validation).includes(false)) {
      toast.warning("Please enter a strong password!");
      return;
    }

    try {
      await axios.post(
        BASE_URL + "/profile/password",
        { password: oldPass, newPassword: password },
        { withCredentials: true }
      );

      toast.success("Password updated successfully. Please log in again.");
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password. Check old password.");
    }
  };

  const handleDelete = async () => {
    if (!confirmText || email !== confirmText.trim()) {
      toast.error("Please enter your email correctly to confirm deletion.");
      return;
    }

    try {
      await axios.delete(BASE_URL + "/profile/delete", { withCredentials: true });
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      navigate("/login");
      toast.success("Account successfully deleted.");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };


  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? '' : sectionName);
  };


  const renderHeader = (title, sectionName) => (
    <div
      onClick={() => toggleSection(sectionName)}
      className={`flex justify-between items-center p-4 cursor-pointer transition duration-300 rounded-t-lg
                        ${openSection === sectionName ? 'bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-b border-gray-200'}
                        ${sectionName === 'delete' && openSection !== 'delete' ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100' : ''}
                        ${sectionName === 'delete' && openSection === 'delete' ? 'bg-red-600 text-white' : ''}
                        `}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <span>{openSection === sectionName ? '▲' : '▼'}</span>
    </div>
  );


  return (
    <div className='p-4 md:p-8 min-h-screen bg-gray-50'>
      <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>Profile Settings</h1>

      <div className='max-w-4xl mx-auto space-y-4'>

        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          {renderHeader('General Details', 'details')}
          {openSection === 'details' && (
            <div className="p-6">
              <div className="flex justify-end mb-6">
                <ActionButton
                  onClick={() => {
                    if (isEditingDetails) { updateUser(); }
                    setIsEditingDetails(!isEditingDetails);
                  }}
                  isEditing={isEditingDetails}
                  label="Edit Details"
                  icon={<EditIcon />}
                />
              </div>

              <AccordionInputField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditingDetails}
              />
              <AccordionInputField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditingDetails}
              />
              <AccordionInputField
                label="Email Address"
                value={email}
                type="email"
                disabled={true}
              />
            </div>
          )}
        </div>

        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          {renderHeader('Security & Password', 'security')}
          {openSection === 'security' && (
            <div className="p-6">
              <div className="flex justify-end mb-6">
                <ActionButton
                  onClick={() => {
                    if (isEditingPassword) { updatePassword(); }
                    setIsEditingPassword(!isEditingPassword);
                  }}
                  isEditing={isEditingPassword}
                  label="Change Password"
                  icon={<EditIcon />}
                />
              </div>

              <AccordionInputField
                label="Old Password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                type="password"
                disabled={!isEditingPassword}
              />
              <AccordionInputField
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                disabled={!isEditingPassword}
              />


              {isEditingPassword && showValidation && (
                <div className='p-3 mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50'>
                  <p className="text-md font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="text-sm space-y-1">
                    <li className={validation.upper ? "text-green-600" : "text-red-600"}>
                      • Contains uppercase letter
                    </li>
                    <li className={validation.lower ? "text-green-600" : "text-red-600"}>
                      • Contains lowercase letter
                    </li>
                    <li className={validation.number ? "text-green-600" : "text-red-600"}>
                      • Contains number
                    </li>
                    <li className={validation.length ? "text-green-600" : "text-red-600"}>
                      • Minimum 8 characters
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          {renderHeader('Account Management', 'delete')}
          {openSection === 'delete' && (
            <div className="p-6">
              <p className='text-gray-700 mb-4'>
                This action will permanently delete your account and all associated data. This cannot be undone.
              </p>

              <button
                onClick={() => { setIsDeleting(!isDeleting); setConfirmText(""); }}
                className={`w-full p-3 text-white rounded-lg text-lg font-semibold transition-colors
                                            ${isDeleting ? "bg-gray-500 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"} flex items-center justify-center gap-2`}
              >
                {isDeleting ? "Cancel Confirmation" : <><DeleteIcon /> Delete Account</>}
              </button>

              {isDeleting && (
                <div className='mt-4 p-4 border border-red-300 rounded-lg bg-red-50'>
                  <p className='text-center text-red-800 font-medium mb-3'>
                    To confirm, please type your email (<span className='font-mono font-bold'>{email}</span>) below.
                  </p>
                  <input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    type="text"
                    placeholder='Enter your email for confirmation'
                    className='w-full p-3 border rounded-lg border-gray-400 focus:ring-red-500 focus:border-red-500'
                  />
                  <button
                    onClick={handleDelete}
                    className='mt-3 w-full p-3 bg-red-700 hover:bg-red-800 rounded-lg text-lg text-white font-semibold transition-colors'
                  >
                    Confirm Permanent Deletion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;