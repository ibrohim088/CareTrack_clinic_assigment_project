// src/config/swagger.js

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "CareTrack Clinic API",
      version: "1.0.0",
      description:
        "Medical Records Management System Full API Documentation",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],

    tags: [
      {
        name: "Auth",
      },
      {
        name: "Doctors",
      },
      {
        name: "Patients",
      },
      {
        name: "Diagnosis",
      },
      {
        name: "Appointments",
      },
      {
        name: "Prescriptions",
      },
      {
        name: "Schedules",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Register: {
          type: "object",

          required: ["fullName", "email", "password"],

          properties: {
            fullName: {
              type: "string",
              example: "John Doe",
            },

            email: {
              type: "string",
              example: "john@gmail.com",
            },

            password: {
              type: "string",
              example: "12345678",
            },

            role: {
              type: "string",
              example: "admin",
            },
          },
        },

        Login: {
          type: "object",

          properties: {
            email: {
              type: "string",
            },

            password: {
              type: "string",
            },
          },
        },

        Doctor: {
          type: "object",

          properties: {
            fullName: {
              type: "string",
            },

            specialization: {
              type: "string",
            },

            department: {
              type: "string",
            },

            phone: {
              type: "string",
            },

            experience: {
              type: "number",
            },
          },
        },

        Patient: {
          type: "object",

          properties: {
            fullName: {
              type: "string",
            },

            age: {
              type: "number",
            },

            gender: {
              type: "string",
            },

            bloodGroup: {
              type: "string",
            },

            phone: {
              type: "string",
            },

            address: {
              type: "string",
            },

            doctor: {
              type: "string",
            },
          },
        },

        Diagnosis: {
          type: "object",

          properties: {
            icdCode: {
              type: "string",
            },

            diseaseName: {
              type: "string",
            },

            severity: {
              type: "string",
            },

            description: {
              type: "string",
            },

            patient: {
              type: "string",
            },
          },
        },

        Appointment: {
          type: "object",

          properties: {
            patient: {
              type: "string",
            },

            doctor: {
              type: "string",
            },

            appointmentDate: {
              type: "string",
            },

            status: {
              type: "string",
            },
          },
        },

        Prescription: {
          type: "object",

          properties: {
            medicineName: {
              type: "string",
            },

            dosage: {
              type: "string",
            },

            duration: {
              type: "string",
            },

            patient: {
              type: "string",
            },
          },
        },
      },

      responses: {
        UnauthorizedError: {
          description: "Access token missing or invalid",
        },
      },
    },

    paths: {
      /*
      ==================================================
      AUTH
      ==================================================
      */

      "/auth/register": {
        post: {
          tags: ["Auth"],

          summary: "Register User",

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Register",
                },
              },
            },
          },

          responses: {
            201: {
              description: "User registered successfully",
            },
          },
        },
      },

      "/auth/login": {
        post: {
          tags: ["Auth"],

          summary: "Login User",

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Login",
                },
              },
            },
          },

          responses: {
            200: {
              description: "Login successful",
            },
          },
        },
      },

      /*
      ==================================================
      DOCTORS
      ==================================================
      */

      "/doctors": {
        get: {
          tags: ["Doctors"],

          summary: "Get all doctors",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Doctors list",
            },
          },
        },

        post: {
          tags: ["Doctors"],

          summary: "Create doctor",

          security: [
            {
              bearerAuth: [],
            },
          ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Doctor",
                },
              },
            },
          },

          responses: {
            201: {
              description: "Doctor created",
            },
          },
        },
      },

      "/doctors/{id}": {
        get: {
          tags: ["Doctors"],

          summary: "Get doctor by ID",

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Doctor details",
            },
          },
        },

        put: {
          tags: ["Doctors"],

          summary: "Update doctor",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Doctor",
                },
              },
            },
          },

          responses: {
            200: {
              description: "Doctor updated",
            },
          },
        },

        delete: {
          tags: ["Doctors"],

          summary: "Delete doctor",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Doctor deleted",
            },
          },
        },
      },

      /*
      ==================================================
      PATIENTS
      ==================================================
      */

      "/patients": {
        get: {
          tags: ["Patients"],

          summary: "Get all patients",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Patients list",
            },
          },
        },

        post: {
          tags: ["Patients"],

          summary: "Create patient",

          security: [
            {
              bearerAuth: [],
            },
          ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Patient",
                },
              },
            },
          },

          responses: {
            201: {
              description: "Patient created",
            },
          },
        },
      },

      "/patients/{id}": {
        get: {
          tags: ["Patients"],

          summary: "Get patient by ID",

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Patient details",
            },
          },
        },

        put: {
          tags: ["Patients"],

          summary: "Update patient",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Patient",
                },
              },
            },
          },

          responses: {
            200: {
              description: "Patient updated",
            },
          },
        },

        delete: {
          tags: ["Patients"],

          summary: "Delete patient",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,

              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Patient deleted",
            },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };