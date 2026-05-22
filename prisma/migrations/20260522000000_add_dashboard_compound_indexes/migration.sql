-- Dashboard and queue access patterns are tenant-scoped and usually ordered by recency.
CREATE INDEX "leads_user_id_status_created_at_idx" ON "leads"("user_id", "status", "created_at");
CREATE INDEX "templates_user_id_updated_at_idx" ON "templates"("user_id", "updated_at");
CREATE INDEX "campaigns_user_id_updated_at_idx" ON "campaigns"("user_id", "updated_at");
CREATE INDEX "campaigns_user_id_status_updated_at_idx" ON "campaigns"("user_id", "status", "updated_at");
CREATE INDEX "messages_user_id_created_at_idx" ON "messages"("user_id", "created_at");
CREATE INDEX "messages_user_id_status_created_at_idx" ON "messages"("user_id", "status", "created_at");
CREATE INDEX "messages_user_id_direction_created_at_idx" ON "messages"("user_id", "direction", "created_at");
CREATE INDEX "conversations_user_id_last_message_at_idx" ON "conversations"("user_id", "last_message_at");
