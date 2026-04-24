-- AlterTable
ALTER TABLE "User" ADD COLUMN     "showBirthPlace" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showCurrentCity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showCurrentCountry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showCurrentState" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showDateOfBirth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showLegalName" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showMaritalStatus" BOOLEAN NOT NULL DEFAULT false;