import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { ChangeMemberRole, GetOrganizationMembers, JoinOrganization, RemoveOrganizationMember } from '../controllers/organizationMember.controller.js';

const OrganMemberRouter = express.Router();

//→ Join an organization using invite code
OrganMemberRouter.post("/join",AuthMiddleware,JoinOrganization)

// → Get all members of an organization
OrganMemberRouter.get("/:organizationId/members",AuthMiddleware,GetOrganizationMembers)

// //→ Change a member's role
// //→ Admin only
OrganMemberRouter.patch("/:organizationId/members/:userId",AuthMiddleware,ChangeMemberRole)

// //→ Remove a member from organization
// //→ Admin only
OrganMemberRouter.delete("/:organizationId/members/:userId",AuthMiddleware,RemoveOrganizationMember)
export default OrganMemberRouter;