import { PolicyAdjustments } from "@/config/api"
import type { MailSender } from "@/core/types/models"
import { BaseCrudService } from "@/core/ui-service"

export class MailSendersService extends BaseCrudService<MailSender>(PolicyAdjustments, 'admin/mail_senders') { }
