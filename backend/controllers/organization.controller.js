import { InviteCodeGenerator } from "../utils/invitecode.utils.js";
import Organization from "../models/organization.model.js";
import OrganizationMember from "../models/organizationMember.model.js";

export async function CreateOrganization(req, res) {
  // authMiddleware se req.user ki value mil jaaegi ke kisne banaya hai
  const { organizationName } = req.body;
  const userId = req.user.userId;

  const InviteCode = InviteCodeGenerator(organizationName);

  try {
    const NewOrganization = await Organization.create({
      name: organizationName,
      inviteCode: InviteCode,
      createdBy: userId,
    });

    await OrganizationMember.create({
      organizationId: NewOrganization._id,
      userId: req.user.userId,
      role: "admin",
    });

    res.status(201).json({
      message: "Organization Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
}

export async function GetOrganizations(req, res) {
  const userId = req.user.userId; //Authmiddleware se mil jaata hai user id

  const In_how_many_organization_this_user_is = await OrganizationMember.find({
    userId,
  });
  const organizationIds = In_how_many_organization_this_user_is.map(
    (member) => {
      return member.organizationId;
    },
  );
  const No_of_Organizations = await Organization.find({
    _id: {
      $in: organizationIds,
    },
  });

  res.json({
    message: "Working",
    No_of_Organizations,
  });
}

export async function GetOrganization(req, res) {
  const user = req.user.userId;
  const which_Organization = req.params.organizationId;

  const isMemberExist_inOrganization = await OrganizationMember.findOne({
    userId: user,
    organizationId: which_Organization,
  });
  if (!isMemberExist_inOrganization) {
    return res.status(403).json({
      message: "Member in this Organization doesn't exist",
    });
  }
  const OrganizationFound = await Organization.findOne({
    _id: which_Organization,
  });

  res.status(200).json({
    message: "Organization Found successfully",
    OrganizationFound,
  });
}

export async function UpdateOrganization(req, res) {
  const user = req.user.userId;
  const which_Organization = req.params.organizationId;
  const { newName } = req.body;

  const isMemberExist_inOrganization = await OrganizationMember.findOne({
    userId: user,
    organizationId: which_Organization,
    role: "admin",
  });
  if (!isMemberExist_inOrganization) {
    return res.status(403).json({
      message: "Member in this Organization is not an Admin",
    });
  }
  try {
    const OrganizationFound = await Organization.findOne({
      _id: which_Organization,
    });

    OrganizationFound.name = newName;
    await OrganizationFound.save();

    res.status(200).json({
      message: `Changes Occur Successfully\nNew Name of the Organization is ${OrganizationFound.name}`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

// DELETE /api/organizations/:organizationId
//                     ↓
//              AuthMiddleware
//                     ↓
//           req.user.userId
//                     +
//        req.params.organizationId
//                     ↓
//         OrganizationMember.findOne()
//                     ↓
//        user + organization match?
//                ↙          ↘
//              NO            YES
//              ↓              ↓
//             403        role = admin?
//                          ↙       ↘
//                        NO         YES
//                        ↓           ↓
//                       403      Organization.findOne()
//                                     ↓
//                               Organization exists?
//                                 ↙          ↘
//                               NO            YES
//                               ↓              ↓
//                              404          Delete
//                                             ↓
//                                            200

export async function DeleteOrganization(req, res) {
  const user = req.user.userId;
  const which_Organization = req.params.organizationId;

  const isMemberExist_inOrganization = await OrganizationMember.findOne({
    userId: user,
    organizationId: which_Organization,
    role: "admin",
  });

  if (!isMemberExist_inOrganization) {
    return res.status(403).json({
      message: "Member in this Organization is not an Admin",
    });
  }

  try {
    const OrganizationFound = await Organization.findOne({
      _id: which_Organization,
    });

    if (!OrganizationFound) {
     return res.json({
        message:"Organization does not found"
      })
    }
    await OrganizationFound.deleteOne()
    res.status(200).json({
      message: `Organization Deleted Successfully`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}
