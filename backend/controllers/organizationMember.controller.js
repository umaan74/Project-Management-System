import Organization from "../models/organization.model.js";
import OrganizationMember from "../models/organizationMember.model.js";

// Join Function Logic
export async function JoinOrganization(req, res) {
  const userId = req.user.userId;
  const inviteCode = req.body.inviteCode;

  const findOrganization = await Organization.findOne({
    inviteCode,
  });
  if (!findOrganization) {
    return res.json({
      message: "Organization does not found",
    });
  }
  const alreadyInOrgan = await OrganizationMember.findOne({
    userId,
    organizationId: findOrganization._id,
  });
  if (alreadyInOrgan) {
    return res.status(400).json({
      message: "User Already in the Organization",
    });
  }

  const NewMember = await OrganizationMember.create({
    organizationId: findOrganization._id,
    userId: userId,
    role: "member",
  });

  res.status(201).json({
    message: "User joined Successfully in the Organization",
    NewMember,
  });
}

export async function GetOrganizationMembers(req, res) {
  const userId = req.user.userId;
  const organizationId = req.params.organizationId;

  const Is_requesterIs_a_Member_of_this_Organization =
    await OrganizationMember.findOne({
      userId,
      organizationId,
    });

  if (!Is_requesterIs_a_Member_of_this_Organization) {
    return res.status(403).json({
      message: "Permission denied User is not in this Organization",
    });
  }

  const findOrganization = await OrganizationMember.find({
    organizationId,
  });

  if (findOrganization.length === 0) {
    return res.status(403).json({
      message: "Members not found",
    });
  }
  const AllMember_of_Organization = findOrganization.map((member) => {
    return member.userId;
  });

  res.json({
    message: "Member's found Successfully",
    AllMember_of_Organization,
  });
}

// ChangeMemberRole function
export async function ChangeMemberRole(req, res) {
  const userId = req.user.userId;
  const organizationId = req.params.organizationId;

  const isRequester_isAdmin = await OrganizationMember.findOne({
    userId,
    organizationId,
    role: "admin",
  });

  if (!isRequester_isAdmin) {
    return res.status(403).json({
      message: "The Requested user is not an Admin, Permission Denied",
    });
  }

  try {
    const targeted_user = req.params.userId;
    const isUserExist = await OrganizationMember.findOne({
      userId: targeted_user,
      organizationId,
    });
    if (!isUserExist) {
      return res.status(404).json({
        message: "Targetted User not found",
      });
    }

    const NewRole = req.body.role;

    if (NewRole !== "admin" && NewRole !== "member") {
      return res.status(400).json({
        message: "Invalid role. Role must be admin or member",
      });
    }
    if (isUserExist.role === NewRole) {
      return res.status(400).json({
        message: "User already has this role",
      });
    }

    isUserExist.role = NewRole;
    await isUserExist.save();

    res.status(200).json({
      message: "Role changed Successfully",
      isUserExist,
    });
  } catch (error) {
    res.json(error);
  }
}

// function RemoveOrganizationMember
export async function RemoveOrganizationMember(req, res) {
  const userId = req.user.userId;
  const organizationId = req.params.organizationId;

  const isRequester_isAdmin = await OrganizationMember.findOne({
    userId,
    organizationId,
    role: "admin",
  });

  if (!isRequester_isAdmin) {
    return res.status(403).json({
      message: "The Requested user is not an Admin, Permission Denied",
    });
  }

  try {
    const targeted_user = req.params.userId;
    const isUserExist = await OrganizationMember.findOne({
      userId: targeted_user,
      organizationId,
    });
    if (!isUserExist) {
      return res.status(404).json({
        message: "Targetted User not found",
      });
    }

   await isUserExist.deleteOne({
      userId: targeted_user,
      organizationId,
    });

    const findOrganization = await OrganizationMember.find({
      organizationId,
    });

    if (findOrganization.length === 0) {
      return res.status(403).json({
        message: "Members not found",
      });
    }
    const AllMember_of_Organization = findOrganization.map((member) => {
      return member.userId;
    });
    res.status(200).json({
      message: "Targeted User deleted Successfully",
      AllMember_of_Organization,
    });
  } catch (error) {
    res.json(error);
  }
}
