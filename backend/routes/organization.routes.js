import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import {
  CreateOrganization,
  GetOrganizations,
  GetOrganization,
  UpdateOrganization,
  DeleteOrganization,
} from "../controllers/organization.controller.js";

const OrganRouter = express.Router();

OrganRouter.post("/", AuthMiddleware, CreateOrganization); // Create Organization

OrganRouter.get("/", AuthMiddleware, GetOrganizations); // See all user's Organizations

OrganRouter.get("/:organizationId", AuthMiddleware, GetOrganization); // See one Organization

OrganRouter.patch("/:organizationId", AuthMiddleware, UpdateOrganization); // Update

OrganRouter.delete("/:organizationId", AuthMiddleware, DeleteOrganization); // Delete

export default OrganRouter;
