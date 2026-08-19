"use client";

import { Bell, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUnreadNotifications, loadDemoCase, markNotificationRead } from "@/data/demo-case-store";
import { demoUnifiedCase, type CaseNotification } from "@/data/unified-case";

export default function NotificationBell() {
  const [open, setOpen] = useState(false); const [notifications, setNotifications] = useState<CaseNotification[]>(demoUnifiedCase.notifications);
  function refresh() { setNotifications(loadDemoCase(demoUnifiedCase.id).notifications); }
  useEffect(() => { refresh(); window.addEventListener("nyaya-demo-case-updated", refresh); return () => window.removeEventListener("nyaya-demo-case-updated", refresh); }, []);
  const unread = getUnreadNotifications({ ...demoUnifiedCase, notifications }).length;
  function openNotification(notification: CaseNotification) { if (!notification.read) { const updated = markNotificationRead(notification.caseId, notification.id); setNotifications(updated.notifications); } setOpen(false); }
  return <div className="notification-bell"><button aria-expanded={open} aria-label={`${unread} unread demo notifications`} onClick={() => setOpen(!open)}><Bell aria-hidden="true" />{unread > 0 && <span>{unread}</span>}</button>{open && <section className="notification-popover" aria-label="Notifications"><header><div><b>Notifications</b><small>Synthetic local activity</small></div><button aria-label="Close notifications" onClick={() => setOpen(false)}><X aria-hidden="true" /></button></header><div>{notifications.slice(0, 4).map((notification) => <Link className={notification.read ? "read" : "unread"} href={notification.href ?? "/notifications"} key={notification.id} onClick={() => openNotification(notification)}><i aria-hidden="true" /><div><span>{notification.type}</span><b>{notification.title}</b><p>{notification.message}</p></div></Link>)}</div><Link className="view-notifications" href="/notifications" onClick={() => setOpen(false)}>View all notifications →</Link></section>}</div>;
}
