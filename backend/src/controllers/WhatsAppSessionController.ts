import { Request, Response } from "express";
import { getWbot, removeWbot } from "../libs/wbot";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";

const store = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { tenantId } = req.user;
  const whatsapp = await ShowWhatsAppService({ id: whatsappId, tenantId });

  StartWhatsAppSession(whatsapp);

  return res.status(200).json({ message: "Starting session." });
};

const update = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { tenantId } = req.user;

  const { whatsapp } = await UpdateWhatsAppService({
    whatsappId,
    whatsappData: { session: "" },
    tenantId
  });

  await removeWbot(+whatsappId);
  StartWhatsAppSession(whatsapp);

  return res.status(200).json({ message: "Starting session." });
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { tenantId } = req.user;
  const whatsapp = await ShowWhatsAppService({ id: whatsappId, tenantId });

  const wbot = getWbot(whatsapp.id);

  wbot.logout();
  await removeWbot(whatsapp.id);

  return res.status(200).json({ message: "Session disconnected." });
};

export default { store, remove, update };

