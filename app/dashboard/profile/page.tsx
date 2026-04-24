"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { updateProfileAction } from "../../actions/updateProfileAction";
import NextImage from "next/image";
import Link from "next/link";
import DobChangeModal from "../../../components/DobChangeModal";

type ClerkMetadata = {
  tagline?: string;
  bio?: string;
  // Profile data fields
  profilePicture?: string;
  legalName?: string;
  dateOfBirth?: string;
  birthPlace?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  maritalStatus?: string;
  phoneNumber?: string;
  occupation?: string;
  employer?: string;
  education?: string;
  socialSecurity?: string;
  driversLicense?: string;
  passport?: string;
  previousAddresses?: string;
  militaryService?: string;
  criminalHistory?: string;
  // Visibility settings
  showUsername?: boolean;
  showTagline?: boolean;
  showBio?: boolean;
  // Individual Identity Verification field visibility
  showLegalName?: boolean;
  showDateOfBirth?: boolean;
  showBirthPlace?: boolean;
  showCurrentCity?: boolean;
  showCurrentState?: boolean;
  showCurrentCountry?: boolean;
  showMaritalStatus?: boolean;
  // Section visibility
  showBasicInfo?: boolean;
  showContactInfo?: boolean;
  showProfessionalInfo?: boolean;
  showGovernmentIds?: boolean;
  showAdditionalInfo?: boolean;
};

export default function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"edit" | "post">("edit");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDobModal, setShowDobModal] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    tagline: "",
    bio: "",
    profilePicture: "",
    legalName: "",
    dateOfBirth: "",
    birthPlace: "",
    currentCity: "",
    currentState: "",
    currentCountry: "",
    maritalStatus: "",
    phoneNumber: "",
    email: "",
    occupation: "",
    employer: "",
    education: "",
    socialSecurity: "",
    driversLicense: "",
    passport: "",
    previousAddresses: "",
    militaryService: "",
    criminalHistory: "",
  });

  // Visibility toggles for each profile section
  const [sectionVisibility, setSectionVisibility] = useState({
    showUsername: false,
    showTagline: false,
    showBio: false,
    // Individual Identity Verification fields
    showLegalName: false,
    showDateOfBirth: false,
    showBirthPlace: false,
    showCurrentCity: false,
    showCurrentState: false,
    showCurrentCountry: false,
    showMaritalStatus: false,
    // Section toggles
    showBasicInfo: false,
    showContactInfo: false,
    showProfessionalInfo: false,
    showGovernmentIds: false,
    showAdditionalInfo: false,
  });

  // Load profile picture from database
  const loadProfilePicture = async () => {
    try {
      const response = await fetch("/api/profile-picture/current");
      const data = await response.json();
      if (response.ok && data.profilePicture) {
        setFormData(prev => ({ ...prev, profilePicture: data.profilePicture }));
        console.log("Loaded profile picture from database, length:", data.profilePicture.length);
      } else {
        console.log("No profile picture found in database");
      }
    } catch (error) {
      console.error("Failed to load profile picture:", error);
    }
  };

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      const publicMeta = user.publicMetadata as ClerkMetadata | undefined;
      console.log("Loading user data from Clerk and database...");
      
      // Load basic data from Clerk
      setFormData({
        username: user.username || "",
        tagline: publicMeta?.tagline || "Bearing witness to truth.",
        bio: publicMeta?.bio || "",
        profilePicture: "", // Will be loaded from database
        legalName: publicMeta?.legalName || "",
        dateOfBirth: "", // Will be loaded from database (COPPA verification)
        birthPlace: publicMeta?.birthPlace || "",
        currentCity: publicMeta?.currentCity || "",
        currentState: publicMeta?.currentState || "",
        currentCountry: publicMeta?.currentCountry || "",
        maritalStatus: publicMeta?.maritalStatus || "",
        phoneNumber: publicMeta?.phoneNumber || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        occupation: publicMeta?.occupation || "",
        employer: publicMeta?.employer || "",
        education: publicMeta?.education || "",
        socialSecurity: publicMeta?.socialSecurity || "",
        driversLicense: publicMeta?.driversLicense || "",
        passport: publicMeta?.passport || "",
        previousAddresses: publicMeta?.previousAddresses || "",
        militaryService: publicMeta?.militaryService || "",
        criminalHistory: publicMeta?.criminalHistory || "",
      });
      
      // Load date of birth from database (from COPPA verification)
      loadUserDataFromDatabase();
      
      // Load visibility settings from user metadata
      setSectionVisibility({
        showUsername: publicMeta?.showUsername || false,
        showTagline: publicMeta?.showTagline || false,
        showBio: publicMeta?.showBio || false,
        // Individual Identity Verification fields
        showLegalName: publicMeta?.showLegalName || false,
        showDateOfBirth: publicMeta?.showDateOfBirth || false,
        showBirthPlace: publicMeta?.showBirthPlace || false,
        showCurrentCity: publicMeta?.showCurrentCity || false,
        showCurrentState: publicMeta?.showCurrentState || false,
        showCurrentCountry: publicMeta?.showCurrentCountry || false,
        showMaritalStatus: publicMeta?.showMaritalStatus || false,
        // Section toggles
        showBasicInfo: publicMeta?.showBasicInfo || false,
        showContactInfo: publicMeta?.showContactInfo || false,
        showProfessionalInfo: publicMeta?.showProfessionalInfo || false,
        showGovernmentIds: publicMeta?.showGovernmentIds || false,
        showAdditionalInfo: publicMeta?.showAdditionalInfo || false,
      });
      
      // Load profile picture from database
      loadProfilePicture();
    }
  }, [user]);

  // Load user data from database
  async function loadUserDataFromDatabase() {
    try {
      const response = await fetch('/api/user/age-verification-status');
      if (response.ok) {
        const { dateOfBirth } = await response.json();
        if (dateOfBirth) {
          setFormData(prev => ({
            ...prev,
            dateOfBirth: new Date(dateOfBirth).toISOString().split('T')[0]
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load user data from database:', error);
    }
  }

  // Handle profile update
  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("username", formData.username);
    fd.append("tagline", formData.tagline);
    fd.append("bio", formData.bio);
    fd.append("profilePicture", formData.profilePicture);
    fd.append("legalName", formData.legalName);
    fd.append("dateOfBirth", formData.dateOfBirth);
    fd.append("birthPlace", formData.birthPlace);
    fd.append("currentCity", formData.currentCity);
    fd.append("currentState", formData.currentState);
    fd.append("currentCountry", formData.currentCountry);
    fd.append("maritalStatus", formData.maritalStatus);
    fd.append("phoneNumber", formData.phoneNumber);
    fd.append("email", formData.email);
    fd.append("occupation", formData.occupation);
    fd.append("employer", formData.employer);
    fd.append("education", formData.education);
    fd.append("socialSecurity", formData.socialSecurity);
    fd.append("driversLicense", formData.driversLicense);
    fd.append("passport", formData.passport);
    fd.append("previousAddresses", formData.previousAddresses);
    fd.append("militaryService", formData.militaryService);
    fd.append("criminalHistory", formData.criminalHistory);
    
    // Add visibility settings
    fd.append("showUsername", sectionVisibility.showUsername.toString());
    fd.append("showTagline", sectionVisibility.showTagline.toString());
    fd.append("showBio", sectionVisibility.showBio.toString());
    // Individual Identity Verification fields
    fd.append("showLegalName", sectionVisibility.showLegalName.toString());
    fd.append("showDateOfBirth", sectionVisibility.showDateOfBirth.toString());
    fd.append("showBirthPlace", sectionVisibility.showBirthPlace.toString());
    fd.append("showCurrentCity", sectionVisibility.showCurrentCity.toString());
    fd.append("showCurrentState", sectionVisibility.showCurrentState.toString());
    fd.append("showCurrentCountry", sectionVisibility.showCurrentCountry.toString());
    fd.append("showMaritalStatus", sectionVisibility.showMaritalStatus.toString());
    // Section visibility
    fd.append("showBasicInfo", sectionVisibility.showBasicInfo.toString());
    fd.append("showContactInfo", sectionVisibility.showContactInfo.toString());
    fd.append("showProfessionalInfo", sectionVisibility.showProfessionalInfo.toString());
    fd.append("showGovernmentIds", sectionVisibility.showGovernmentIds.toString());
    fd.append("showAdditionalInfo", sectionVisibility.showAdditionalInfo.toString());

    console.log("Submitting profile with picture:", formData.profilePicture ? "Yes, length:" + formData.profilePicture.length : "No");
    console.log("Profile picture in formData:", formData.profilePicture.substring(0, 50) + "...");
    const result = await updateProfileAction(fd);
    if (result?.error) {
        setMessage(`❌ ${result.error}`);
        console.error("Profile update error:", result.error);
      } else {
        setMessage("✅ Profile updated successfully!");
        console.log("Profile updated successfully");
      }
    setLoading(false);
  }



  // Function to compress and resize image
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800x800)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original
          }
        }, 'image/jpeg', 0.8); // 80% quality
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle profile picture upload
  async function handleProfilePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    setMessage("");

    try {
      // Compress large images
      let fileToUpload = file;
      if (file.size > 1024 * 1024) { // If larger than 1MB, compress
        setMessage("🔄 Compressing large image...");
        fileToUpload = await compressImage(file);
        console.log("Compressed:", file.size, "->", fileToUpload.size);
      }

      const uploadFormData = new FormData();
      uploadFormData.append("profilePicture", fileToUpload);

      const response = await fetch("/api/profile-picture", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        const newFormData = { ...formData, profilePicture: data.url };
        setFormData(newFormData);
        setMessage(`✅ Profile picture uploaded successfully!`);
        console.log("Profile picture uploaded successfully. URL:", data.url);
        console.log("Form data updated with profile picture. Length:", data.url.length);
      } else {
        console.error("Upload failed:", response.status, data);
        setMessage(`❌ ${data.error || "Failed to upload profile picture"}`);
      }
    } catch (err) {
      console.error("Upload error details:", err);
      setMessage("❌ Network Error: " + (err as Error).message);
    } finally {
      setImageLoading(false);
      // Reset file input
      e.target.value = "";
    }
  }

  // Handle profile picture removal
  async function handleRemoveProfilePicture() {
    if (!formData.profilePicture) return;

    setImageLoading(true);
    setMessage("");

    try {
      // Simply remove the picture from state (no file to delete since we use base64)
      setFormData({ ...formData, profilePicture: "" });
      setMessage("✅ Profile picture removed successfully!");
    } catch (err) {
      setMessage("❌ Error: " + (err as Error).message);
    } finally {
      setImageLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your profile, uploads, and posts</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "edit"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            ✏️ Edit Profile
          </button>
          <Link
            href="/report-issue"
            className="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition"
          >
            🚧 Report Issue
          </Link>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-gray-100 border border-gray-300">
            {message}
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* EDIT PROFILE */}
          {activeTab === "edit" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Edit Your Profile</h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionVisibility.showUsername}
                      onChange={(e) =>
                        setSectionVisibility({ ...sectionVisibility, showUsername: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Show on public profile</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Your username"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tagline
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionVisibility.showTagline}
                      onChange={(e) =>
                        setSectionVisibility({ ...sectionVisibility, showTagline: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Show on public profile</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Example: Bearing witness to truth."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Biography
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionVisibility.showBio}
                      onChange={(e) =>
                        setSectionVisibility({ ...sectionVisibility, showBio: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Show on public profile</span>
                  </label>
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={6}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Identity Verification Section */}
              <div className="border-t pt-6 mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionVisibility.showBasicInfo}
                      onChange={(e) =>
                        setSectionVisibility({ ...sectionVisibility, showBasicInfo: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Show on public profile</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Complete your identity verification to become a verified witness. This information helps establish trust in the community.
                </p>

                {/* Profile Picture */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.profilePicture && (
                      <div className="relative">
                        <NextImage
                          src={formData.profilePicture}
                          alt="Current Profile"
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveProfilePicture}
                          disabled={imageLoading}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          disabled={imageLoading}
                          className="hidden"
                          id="profile-picture-upload"
                        />
                        <label
                          htmlFor="profile-picture-upload"
                          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                            imageLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                          } transition-colors`}
                        >
                          {imageLoading ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              📁 {formData.profilePicture ? 'Upload New Photo' : 'Upload Profile Photo'}
                            </>
                          )}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG, or WebP • Max 10MB • Large images automatically compressed • Square image recommended
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Legal Name *
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionVisibility.showLegalName}
                          onChange={(e) =>
                            setSectionVisibility({ ...sectionVisibility, showLegalName: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.legalName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, legalName: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Your full legal name"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Date of Birth *
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionVisibility.showDateOfBirth}
                          onChange={(e) =>
                            setSectionVisibility({ ...sectionVisibility, showDateOfBirth: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Show</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={formData.dateOfBirth || ""}
                        disabled={true}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        title="Date of birth cannot be changed directly for security and verification purposes"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Date of birth is protected for security purposes</span>
                        <button
                          type="button"
                          onClick={() => setShowDobModal(true)}
                          className="text-indigo-600 hover:text-indigo-500 underline"
                        >
                          Request Change
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Birth Place
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionVisibility.showBirthPlace}
                          onChange={(e) =>
                            setSectionVisibility({ ...sectionVisibility, showBirthPlace: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.birthPlace || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, birthPlace: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="City, State/Province, Country"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current City *
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionVisibility.showCurrentCity}
                          onChange={(e) =>
                            setSectionVisibility({ ...sectionVisibility, showCurrentCity: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.currentCity || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, currentCity: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Current city"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current State/Province *
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionVisibility.showCurrentState}
                          onChange={(e) =>
                            setSectionVisibility({ ...sectionVisibility, showCurrentState: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.currentState || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, currentState: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="State or Province"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current Country *
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionVisibility.showCurrentCountry}
                          onChange={(e) =>
                            setSectionVisibility({ ...sectionVisibility, showCurrentCountry: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.currentCountry || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, currentCountry: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Country"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Marital Status
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionVisibility.showMaritalStatus}
                          onChange={(e) =>
                            setSectionVisibility({ ...sectionVisibility, showMaritalStatus: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-xs text-gray-600">Show</span>
                      </label>
                    </div>
                    <select
                      value={formData.maritalStatus || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, maritalStatus: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900">Contact Information</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sectionVisibility.showContactInfo}
                        onChange={(e) =>
                          setSectionVisibility({ ...sectionVisibility, showContactInfo: e.target.checked })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Show on public profile</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border-t pt-6 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900">Professional Information</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sectionVisibility.showProfessionalInfo}
                        onChange={(e) =>
                          setSectionVisibility({ ...sectionVisibility, showProfessionalInfo: e.target.checked })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Show on public profile</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={formData.occupation || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, occupation: e.target.value })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="Your job title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employer
                      </label>
                      <input
                        type="text"
                        value={formData.employer || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, employer: e.target.value })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="Company or organization"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education
                      </label>
                      <textarea
                        value={formData.education || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, education: e.target.value })
                        }
                        rows={3}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                        placeholder="Schools attended, degrees, certifications..."
                      />
                    </div>
                  </div>
                </div>

                {/* Government IDs */}
                <div className="border-t pt-6 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900">Government Identification</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sectionVisibility.showGovernmentIds}
                        onChange={(e) =>
                          setSectionVisibility({ ...sectionVisibility, showGovernmentIds: e.target.checked })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Show on public profile</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Security Number (Last 4 digits)
                      </label>
                      <input
                        type="text"
                        value={formData.socialSecurity || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, socialSecurity: e.target.value })
                        }
                        maxLength={4}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="1234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driver&apos;s License Number
                      </label>
                      <input
                        type="text"
                        value={formData.driversLicense || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, driversLicense: e.target.value })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="DL123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        value={formData.passport || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, passport: e.target.value })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="123456789"
                      />
                    </div>
                  </div>
                </div>





                {/* Additional Information */}
                <div className="border-t pt-6 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900">Additional Information</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sectionVisibility.showAdditionalInfo}
                        onChange={(e) =>
                          setSectionVisibility({ ...sectionVisibility, showAdditionalInfo: e.target.checked })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Show on public profile</span>
                    </label>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Previous Addresses (Last 5 years)
                      </label>
                      <textarea
                        value={formData.previousAddresses || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, previousAddresses: e.target.value })
                        }
                        rows={3}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                        placeholder="List previous addresses with dates..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Military Service
                      </label>
                      <textarea
                        value={formData.militaryService || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, militaryService: e.target.value })
                        }
                        rows={2}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                        placeholder="Branch, rank, years of service, or &apos;None&apos; if not applicable"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Criminal History Disclosure
                      </label>
                      <textarea
                        value={formData.criminalHistory || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, criminalHistory: e.target.value })
                        }
                        rows={2}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                        placeholder="Any criminal convictions or pending charges, or &apos;None&apos; if not applicable"
                      />
                    </div>


                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Privacy Note:</strong> This information is used for verification purposes only. 
                    You control what appears on your public profile. All sensitive information is encrypted and secure.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* DOB Change Request Modal */}
      <DobChangeModal
        isOpen={showDobModal}
        onClose={() => setShowDobModal(false)}
        currentDOB={formData.dateOfBirth}
      />
    </div>
  );
}
