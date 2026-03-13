import { Request, Response, NextFunction } from "express";
import { testimonialService } from "./testimonials.service";
import { success } from "../../utils/apiResponse";

export async function getTestimonials(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { published } = req.query;
    const pub =
      published === "true" ? true : published === "false" ? false : undefined;
    const testimonials = await testimonialService.getTestimonials(pub);
    success(res, testimonials);
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    success(res, testimonial, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const testimonial = await testimonialService.updateTestimonial(
      id,
      req.body,
    );
    success(res, testimonial);
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await testimonialService.deleteTestimonial(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
