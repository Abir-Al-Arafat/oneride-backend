import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import http from "http";
import { initSocket } from "./config/socket";
import { registerChatHandlers } from "./services/chat.service.socket";
import databaseConnection from "./config/database";
import userRouter from "./routes/user.routes";
import userGuestRouter from "./routes/userGuest.routes";
import authRouter from "./routes/auth.routes";
import categoryRouter from "./routes/category.routes";
import transportRouter from "./routes/transport.routes";
import eventRouter from "./routes/event.routes";
import charterRouter from "./routes/charter.routes";
import invitationRouter from "./routes/invitation.routes";
import blogRouter from "./routes/blog.routes";
import allyRouter from "./routes/ally.routes";
import aboutRouter from "./routes/about.routes";
import teamMemberRouter from "./routes/teamMember.routes";
import serviceRouter from "./routes/service.routes";
import bookingRouter from "./routes/booking.routes";
import paymentRouter from "./routes/payment.routes";
import partnershipRouter from "./routes/partnership.routes";
import termRouter from "./routes/term.routes";
import chatRouter from "./routes/chat.routes";
import messageRouter from "./routes/message.routes";

const app = express();
dotenv.config();

app.use(cors({ origin: "*", credentials: true }));

app.use(cookieParser()); // Needed to read cookies
app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: false })); // Parses data as URL-encoded

// google auth using passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Handle Invalid JSON Errors
app.use(
  (
    err: SyntaxError & { status?: number; body?: any },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).send({ message: "Invalid JSON format" });
    }
    next();
  }
);

app.use("/public", express.static(path.join(__dirname, "..", "public")));

const baseApiUrl = "/api";

app.use(`${baseApiUrl}/users`, userRouter);
app.use(`${baseApiUrl}/users-guests`, userGuestRouter);
app.use(`${baseApiUrl}/auth`, authRouter);
app.use(`${baseApiUrl}/categories`, categoryRouter);
app.use(`${baseApiUrl}/transports`, transportRouter);
app.use(`${baseApiUrl}/events`, eventRouter);
app.use(`${baseApiUrl}/charters`, charterRouter);
app.use(`${baseApiUrl}/invitations`, invitationRouter);
app.use(`${baseApiUrl}/blogs`, blogRouter);
app.use(`${baseApiUrl}/allies`, allyRouter);
app.use(`${baseApiUrl}/about-us`, aboutRouter);
app.use(`${baseApiUrl}/team-members`, teamMemberRouter);
app.use(`${baseApiUrl}/services`, serviceRouter);
app.use(`${baseApiUrl}/bookings`, bookingRouter);
app.use(`${baseApiUrl}/payments`, paymentRouter);
app.use(`${baseApiUrl}/partnerships`, partnershipRouter);
app.use(`${baseApiUrl}/terms`, termRouter);
app.use(`${baseApiUrl}/chats`, chatRouter);
app.use(`${baseApiUrl}/messages`, messageRouter);

app.get("/", (req, res) => {
  return res.status(200).send({
    name: "One ride Backend",
    developer: "Abir",
    version: "1.0.0",
    description: "Backend server for one ride Backend",
    status: "success",
  });
});

// ✅ Handle 404 Routes
app.use((req, res) => {
  return res.status(400).send({ message: "Route does not exist" });
});

// ✅ Handle Global Errors
app.use((err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;

// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

// Register chat handlers
registerChatHandlers(io);

databaseConnection(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
