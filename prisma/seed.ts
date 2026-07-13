import "dotenv/config";
import { prisma } from "../lib/db";

const guests = [
  {
    name: "Nguyễn Văn Nam",
    slug: "anh-nam",
    phone: "0901234567",
    group: "Bạn bè",
    invitationTitle: "Anh",
    guestCount: 2,
    rsvpStatus: "ATTENDING" as const,
    message: "Chúc mừng hai bạn, hẹn gặp trong tiệc cưới!",
  },
  {
    name: "Trần Thị Hương",
    slug: "chi-huong",
    phone: "0912345678",
    group: "Đồng nghiệp",
    invitationTitle: "Chị",
    guestCount: 1,
    rsvpStatus: "PENDING" as const,
  },
  {
    name: "Lê Minh Tuấn",
    slug: "anh-tuan",
    email: "tuan.le@example.com",
    group: "Gia đình",
    invitationTitle: "Anh",
    guestCount: 3,
    rsvpStatus: "ATTENDING" as const,
    message: "Cả nhà sẽ đến đầy đủ, chúc mừng em!",
  },
  {
    name: "Phạm Thu Thảo",
    slug: "chi-thao",
    phone: "0987654321",
    group: "Bạn bè",
    invitationTitle: "Chị",
    guestCount: 1,
    rsvpStatus: "NOT_ATTENDING" as const,
    message: "Mình bận công tác nên không thể tham dự, xin lỗi hai bạn.",
  },
  {
    name: "Hoàng Đức Anh",
    slug: "anh-duc-anh",
    group: "Bạn bè",
    invitationTitle: "Anh",
    guestCount: 1,
    rsvpStatus: "PENDING" as const,
  },
];

async function main() {
  for (const guest of guests) {
    await prisma.guest.upsert({
      where: { slug: guest.slug },
      update: guest,
      create: guest,
    });
  }

  console.log(`Seeded ${guests.length} guests.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
