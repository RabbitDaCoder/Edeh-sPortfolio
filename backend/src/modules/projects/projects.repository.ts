import { db } from "../../config/db";
import { CreateProjectInput, UpdateProjectInput } from "./projects.schema";

export class ProjectRepository {
  async findAll(published?: boolean) {
    return db.project.findMany({
      where: published !== undefined ? { published } : {},
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  }

  async findById(id: string) {
    return db.project.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return db.project.findUnique({ where: { slug } });
  }

  async create(data: CreateProjectInput) {
    return db.project.create({ data });
  }

  async update(id: string, data: UpdateProjectInput) {
    return db.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.project.delete({ where: { id } });
  }
}

export const projectRepository = new ProjectRepository();
