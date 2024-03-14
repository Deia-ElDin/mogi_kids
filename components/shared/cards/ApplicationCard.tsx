"use client";

import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { getUsername, toCap } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { ICareer } from "@/lib/database/models/career.model";
import { differenceInDays } from "date-fns";
import IconDeleteBtn from "../btns/IconDeleteBtn";
import BlockBtn from "../btns/BlockBtn";

type ApplicationCardParams = {
  application: ICareer;
  handleDeleteApplication: (id: string) => void;
  handleBlockUser: (id: string) => void;
};

const ApplicationCard: React.FC<ApplicationCardParams> = ({
  application,
  handleDeleteApplication,
  handleBlockUser,
}) => {
  const {
    _id,
    fullName,
    email,
    mobile,
    applyingFor,
    workingAt,
    previousSalary,
    expectedSalary,
    joinDate,
    gender,
    education,
    dhaCertificate,
    careGiverCertificate,
    experienceInUAE,
    visa,
    visaExpireDate,
    coverLetter,
    imgUrl,
    imgSize,
    createdAt,
    updatedAt,
    createdBy,
  } = application;

  const today = new Date();

  const TrueImage = ({ condition }: { condition: boolean }) => (
    <img
      src={`/assets/icons/${condition ? "true" : "false"}.svg`}
      alt="True/false icon"
      height={20}
      width={20}
    />
  );

  const ApplicationHeader: React.FC = () => (
    <div className="flex justify-center">
      <h1 className="text-center font-bold text-lg">{toCap(fullName)}</h1>
      <div className="absolute top-0 right-0">
        <IconDeleteBtn
          deletionTarget="Quotation"
          handleClick={() => handleDeleteApplication(application._id)}
        />
      </div>
    </div>
  );

  const ApplicationBody: React.FC = () => {
    const visaDaysLeft = differenceInDays(new Date(visaExpireDate), today);
    const joiningDaysLeft = differenceInDays(new Date(joinDate), today);
    const isEmptyExpArray = experienceInUAE.every((exp) => exp === "");

    return (
      <div className="flex flex-col gap-4 border-t border-gray-200 mt-4 pt-4">
        <div className="grid grid-cols-2 gap-x-9 gap-y-4">
          {[
            { label: "Gender:", value: gender },
            { label: "Education:", value: education },
            { label: "Working At:", value: workingAt },
            { label: "Applying For:", value: applyingFor },
            { label: "Current / Previous Salary:", value: previousSalary },
            { label: "Expected Salary:", value: expectedSalary },
            {
              label: "DHA Certificate:",
              value: dhaCertificate.toLowerCase(),
            },
            {
              label: "CGC Certificate:",
              value: careGiverCertificate.toLowerCase(),
            },
          ].map((item, index) => (
            <div
              key={`${_id} - ${item.label} - ${index}`}
              className="flex items-center justify-between"
            >
              <p className="text-sm">
                <strong className="mr-2">{item.label}</strong>
              </p>
              {item.label.includes("DHA") || item.label.includes("CGC") ? (
                <TrueImage condition={item.value === "yes" ? true : false} />
              ) : (
                <p
                  className={`text-sm ${
                    item.label === "Gender:" && gender.toLowerCase() === "male"
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              <strong className="mr-2">Visa:</strong>
            </p>
            <TrueImage
              condition={visa.toLowerCase() === "yes" ? true : false}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-9 gap-y-4 mb-7">
          {[
            {
              label: "Visa Expiry Date:",
              value: format(visaExpireDate, "EEE, dd/MM/yyyy"),
              warning: visaDaysLeft <= 0 ? true : false,
            },
            {
              label: visaDaysLeft >= 0 ? "Days Left:" : "Expired Since:",
              value: visaDaysLeft + " Days",
              warning: visaDaysLeft <= 0 ? true : false,
            },
            {
              label: "Joining Date:",
              value: format(joinDate, "EEE, dd/MM/yyyy"),
              warning: joiningDaysLeft <= 0 ? true : false,
            },
            {
              label: joiningDaysLeft >= 0 ? "Days Left:" : "Expired Since:",
              value: joiningDaysLeft + " Days",
              warning: joiningDaysLeft <= 0 ? true : false,
            },
          ].map((item, index) => (
            <div
              key={`${_id} - ${item.label} - ${index}`}
              className="flex items-center justify-between"
            >
              <p className="text-sm">
                <strong className="mr-2">{item.label}</strong>
              </p>
              {item.label.includes("DHA") || item.label.includes("CGC") ? (
                <TrueImage condition={item.value === "yes" ? true : false} />
              ) : (
                <p className={`text-sm ${item.warning ? "text-red-500" : ""}`}>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {!isEmptyExpArray && (
          <div className="flex flex-col items-left">
            <p className="text-sm">
              <strong className="mr-2">Experience in UAE:</strong>
            </p>
            <div>
              {experienceInUAE.map((exp, index) => (
                <p key={`${exp} - ${index}`} className="text-sm leading-6">
                  <strong className="mr-2">{index + 1}.</strong> {exp}
                </p>
              ))}
            </div>
          </div>
        )}
        {coverLetter && (
          <div>
            <p className="text-sm">
              <strong className="mr-2">Cover Letter:</strong>
            </p>
            <p className="text-sm leading-6">{coverLetter}</p>
          </div>
        )}
      </div>
    );
  };

  const ApplicationFooter: React.FC = () => {
    const defaultPhoto = "/assets/icons/user.svg";

    const getUserInfo = () => {
      if (!createdBy) {
        return {
          username: fullName,
          photo: defaultPhoto,
        };
      }

      const {
        _id,
        firstName,
        lastName,
        photo: userPhoto,
      } = createdBy as Partial<IUser>;
      return {
        username: getUsername(firstName, lastName),
        photo: userPhoto ?? defaultPhoto,
        creatorId: _id,
      };
    };

    const { username, photo, creatorId } = getUserInfo();

    return (
      <>
        <div className="flex justify-between items-center mt-8 border-none rounded-lg p-2 shadow-lg w-full bg-gray-50">
          <div className="flex items-center ">
            {photo && (
              <img
                src={photo}
                alt="Customer Image"
                className="w-10 h-10 rounded-full mr-4"
              />
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm">{toCap(username)}</p>
              <p className="text-sm">{email}</p>
              <p className="text-sm">{mobile}</p>
            </div>
          </div>
          <div>
            <a
              href={imgUrl}
              className="bg-blue-500 text-white text-md font-bold  hover:text-lg border-2 hover:border-blue-500 hover:underline px-5 py-2 rounded-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {toCap(fullName.split(" ")[0])}'s Resume
            </a>
          </div>
        </div>

        {creatorId && (
          <div className="mt-2">
            <BlockBtn
              blockText="Block This User"
              handleClick={() => handleBlockUser(creatorId)}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <TableRow>
      <TableCell
        colSpan={11}
        className="my-2 rounded-lg bg-white shadow-inner w-full border-gray-200"
      >
        <div className="p-4 relative">
          <ApplicationHeader />
          <ApplicationBody />
          <ApplicationFooter />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationCard;
