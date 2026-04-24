"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Age verification is disabled - minor protection checks removed
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  // If it's already in YYYY-MM-DD format (from date input), use it directly
  if (dateString.includes('-')) {
    return new Date(dateString + 'T00:00:00.000Z');
  }
  
  // If it's in MM/DD/YYYY format, convert it
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }
  
  // Fallback to original parsing
  return new Date(dateString + 'T00:00:00.000Z');
}

export async function updateProfileAction(formData: FormData) {
  console.log("Starting profile update...");
  const { userId } = await auth();
  if (!userId) {
    console.error("No userId found");
    return { error: "Not authenticated" };
  }
  console.log("User authenticated:", userId);

// Age verification is disabled - all users are treated as verified adults
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      ageVerified: true,
      dateOfBirth: true,
    }
  });

  // Continue without age verification checks

  const username = formData.get("username") as string;
  const tagline = formData.get("tagline") as string;
  const bio = formData.get("bio") as string;
  const profilePicture = formData.get("profilePicture") as string;
  const legalName = formData.get("legalName") as string;
  
  console.log("Profile picture received in server action:", profilePicture ? "Yes, length:" + profilePicture.length : "No");
  console.log("Profile picture data (first 50 chars):", profilePicture ? profilePicture.substring(0, 50) + "..." : "None");
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const currentCity = formData.get("currentCity") as string;
  const currentState = formData.get("currentState") as string;
  const currentCountry = formData.get("currentCountry") as string;
  const maritalStatus = formData.get("maritalStatus") as string;
  let phoneNumber = formData.get("phoneNumber") as string;
  const email = formData.get("email") as string;
  const occupation = formData.get("occupation") as string;
  const employer = formData.get("employer") as string;
  const education = formData.get("education") as string;
  let socialSecurity = formData.get("socialSecurity") as string;
  let driversLicense = formData.get("driversLicense") as string;
  let passport = formData.get("passport") as string;
  let previousAddresses = formData.get("previousAddresses") as string;
  let militaryService = formData.get("militaryService") as string;
  let criminalHistory = formData.get("criminalHistory") as string;
  
  // **EMERGENCY PII PROTECTION FOR MINORS**
  if (existingUser.isMinor) {
    const userAge = existingUser.dateOfBirth 
      ? new Date().getFullYear() - new Date(existingUser.dateOfBirth).getFullYear()
      : 16; // Conservative default
  }
  // Age verification is disabled - no minor protection applied
  
  // Visibility settings
  const showUsername = formData.get("showUsername") === "true";
  const showTagline = formData.get("showTagline") === "true";
  const showBio = formData.get("showBio") === "true";
  const showLegalName = formData.get("showLegalName") === "true";
  const showDateOfBirth = formData.get("showDateOfBirth") === "true";
  const showBirthPlace = formData.get("showBirthPlace") === "true";
  const showCurrentCity = formData.get("showCurrentCity") === "true";
  const showCurrentState = formData.get("showCurrentState") === "true";
  const showCurrentCountry = formData.get("showCurrentCountry") === "true";
  const showMaritalStatus = formData.get("showMaritalStatus") === "true";
  // Section visibility
  const showBasicInfo = formData.get("showBasicInfo") === "true";
  const showContactInfo = formData.get("showContactInfo") === "true";
  const showProfessionalInfo = formData.get("showProfessionalInfo") === "true";
  const showGovernmentIds = formData.get("showGovernmentIds") === "true";
  const showAdditionalInfo = formData.get("showAdditionalInfo") === "true";

  try {
    // Update Clerk user
    console.log("Updating Clerk user...");
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      username,
      publicMetadata: {
        tagline,
        bio,
        // profilePicture, // Don't store large base64 in Clerk metadata - use database instead
        legalName,
        dateOfBirth,
        birthPlace,
        currentCity,
        currentState,
        currentCountry,
        maritalStatus,
        phoneNumber,
        email,
        occupation,
        employer,
        education,
        socialSecurity,
        driversLicense,
        passport,
        previousAddresses,
        militaryService,
        criminalHistory,
        showUsername,
        showTagline,
        showBio,
        showLegalName,
        showDateOfBirth,
        showBirthPlace,
        showCurrentCity,
        showCurrentState,
        showCurrentCountry,
        showMaritalStatus,
        showBasicInfo,
        showContactInfo,
        showProfessionalInfo,
        showGovernmentIds,
        showAdditionalInfo,
      },
    });

    console.log("Clerk update successful, updating database...");
    console.log("Profile picture being saved to database:", profilePicture ? "Yes" : "No");
    
    // Prepare update data dynamically
    const updateData: Record<string, unknown> = {
      username,
      tagline,
      bio,
      legalName: legalName || null,
      dateOfBirth: parseDate(dateOfBirth),
      birthPlace: birthPlace || null,
      currentCity: currentCity || null,
      currentState: currentState || null,
      currentCountry: currentCountry || null,
      maritalStatus: maritalStatus || null,
      phoneNumber: phoneNumber || null,
      email: email || null,
      occupation: occupation || null,
      employer: employer || null,
      education: education || null,
      socialSecurity: socialSecurity || null,
      driversLicense: driversLicense || null,
      passport: passport || null,
      previousAddresses: previousAddresses || null,
      militaryService: militaryService || null,
      criminalHistory: criminalHistory || null,
      showUsername,
      showTagline,
      showBio,
      showLegalName,
      showDateOfBirth,
      showBirthPlace,
      showCurrentCity,
      showCurrentState,
      showCurrentCountry,
      showMaritalStatus,
      showBasicInfo,
      showContactInfo,
      showProfessionalInfo,
      showGovernmentIds,
      showAdditionalInfo,
    };

    // Add profile picture if provided
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    // Update or create database user
    try {
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: updateData,
        create: {
          clerkId: userId,
          username,
          tagline,
          bio,
          legalName: legalName || null,
          dateOfBirth: parseDate(dateOfBirth),
          birthPlace: birthPlace || null,
          currentCity: currentCity || null,
          currentState: currentState || null,
          currentCountry: currentCountry || null,
          maritalStatus: maritalStatus || null,
          phoneNumber: phoneNumber || null,
          email: email || null,
          occupation: occupation || null,
          employer: employer || null,
          education: education || null,
          socialSecurity: socialSecurity || null,
          driversLicense: driversLicense || null,
          passport: passport || null,
          previousAddresses: previousAddresses || null,
          militaryService: militaryService || null,
          criminalHistory: criminalHistory || null,
          showUsername,
          showTagline,
          showBio,
          showLegalName,
          showDateOfBirth,
          showBirthPlace,
          showCurrentCity,
          showCurrentState,
          showCurrentCountry,
          showMaritalStatus,
          showBasicInfo,
          showContactInfo,
          showProfessionalInfo,
          showGovernmentIds,
          showAdditionalInfo,
        },
      });
    } catch (dbError) {
      // Fallback for old schema without individual field visibility columns
      console.warn("Database schema may not have individual field columns, using fallback:", dbError);
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          username,
          tagline,
          bio,
          legalName: legalName || null,
          dateOfBirth: parseDate(dateOfBirth),
          birthPlace: birthPlace || null,
          currentCity: currentCity || null,
          currentState: currentState || null,
          currentCountry: currentCountry || null,
          maritalStatus: maritalStatus || null,
          phoneNumber: phoneNumber || null,
          email: email || null,
          occupation: occupation || null,
          employer: employer || null,
          education: education || null,
          socialSecurity: socialSecurity || null,
          driversLicense: driversLicense || null,
          passport: passport || null,
          previousAddresses: previousAddresses || null,
          militaryService: militaryService || null,
          criminalHistory: criminalHistory || null,
          showUsername,
          showTagline,
          showBio,
          showBasicInfo,
          showContactInfo,
          showProfessionalInfo,
          showGovernmentIds,
          showAdditionalInfo,
        },
        create: {
          clerkId: userId,
          username,
          tagline,
          bio,
          legalName: legalName || null,
          dateOfBirth: parseDate(dateOfBirth),
          birthPlace: birthPlace || null,
          currentCity: currentCity || null,
          currentState: currentState || null,
          currentCountry: currentCountry || null,
          maritalStatus: maritalStatus || null,
          phoneNumber: phoneNumber || null,
          email: email || null,
          occupation: occupation || null,
          employer: employer || null,
          education: education || null,
          socialSecurity: socialSecurity || null,
          driversLicense: driversLicense || null,
          passport: passport || null,
          previousAddresses: previousAddresses || null,
          militaryService: militaryService || null,
          criminalHistory: criminalHistory || null,
          showUsername,
          showTagline,
          showBio,
          showBasicInfo,
          showContactInfo,
          showProfessionalInfo,
          showGovernmentIds,
          showAdditionalInfo,
          ...(profilePicture && { profilePicture }),
        },
      });
    }

    console.log("Profile update completed successfully");
    return { success: true };
  } catch (err) {
    console.error("Update error:", err);
    // Return more specific error information
    if (err instanceof Error) {
      return { error: `Failed to update profile: ${err.message}` };
    }
    return { error: "Failed to update profile - unknown error" };
  }
}
