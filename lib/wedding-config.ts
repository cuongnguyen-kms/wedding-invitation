export type WeddingEvent = {
  title: string;
  date: string;
  weekday: string;
  day: string;
  month: string;
  year: string;
  time: string;
  venue: string;
  address: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
};

export type WeddingScheduleItem = {
  time: string;
  activity: string;
};

export type WeddingFamily = {
  label: string;
  parents: string[];
  address: string;
};

export type WeddingConfig = {
  couple: {
    bride: string;
    groom: string;
    displayNames: string;
    date: string;
    dateLabel: string;
    intro: string;
  };
  guest: {
    greeting: string;
    name: string;
  };
  families: {
    groom: WeddingFamily;
    bride: WeddingFamily;
  };
  events: WeddingEvent[];
  schedule: WeddingScheduleItem[];
  story: TimelineItem[];
  gallery: GalleryPhoto[];
  location: {
    title: string;
    address: string;
    mapUrl: string;
  };
};

export const weddingConfig: WeddingConfig = {
  couple: {
    bride: "Bảo Quyên",
    groom: "Quốc Cường",
    displayNames: "Quốc Cường & Bảo Quyên",
    date: "2026-10-10T10:00:00+07:00",
    dateLabel: "October 10, 2026",
    intro:
      "We are beginning a new chapter surrounded by family, friendship, and the soft joy of a garden in bloom.",
  },
  guest: {
    greeting: "Thân mời",
    name: "Anh Nam",
  },
  events: [
    {
      title: "Wedding Ceremony",
      date: "Sunday, October 11, 2026",
      weekday: "Chủ Nhật",
      day: "11",
      month: "10",
      year: "2026",
      time: "09:00 AM",
      venue: "Tư gia",
      address: "phường An Hội, tỉnh Vĩnh Long",
    },
    {
      title: "Wedding Reception",
      date: "Saturday, October 10, 2026",
      weekday: "Thứ Bảy",
      day: "10",
      month: "10",
      year: "2026",
      time: "6:00 PM",
      venue: "Moonlight Ballroom",
      address: "88 Le Loi, District 1, Ho Chi Minh City",
    },
  ],
  families: {
    groom: {
      label: "Ông bà",
      parents: ["Nguyễn Thế Hùng", "Lê Thị Kim Hoàng"],
      address: "xã Giao Long, tỉnh Vĩnh Long",
    },
    bride: {
      label: "Ông bà",
      parents: ["Lê Công Hòa", "Trầm Thị Thu Lan"],
      address: "phường An Hội, tỉnh Vĩnh Long",
    },
  },
  schedule: [
    {
      time: "17:30",
      activity: "Đón khách",
    },
    {
      time: "18:30",
      activity: "Khai tiệc",
    },
    {
      time: "18:45",
      activity: "Rót rượu, cắt bánh",
    },
    {
      time: "19:00",
      activity: "Phục vụ món chính",
    },
    {
      time: "21:00",
      activity: "Kết thúc tiệc",
    },
  ],
  story: [
    {
      date: "2019",
      title: "First Hello",
      description:
        "A quiet coffee shop, one shared table, and a conversation that somehow forgot to end.",
    },
    {
      date: "2022",
      title: "The Promise",
      description:
        "Through busy seasons and long roads, we learned that home could be a person.",
    },
    {
      date: "2025",
      title: "The Proposal",
      description:
        "Under warm lights and pink flowers, one question turned tomorrow into our favorite word.",
    },
  ],
  gallery: [
    {
      src: "/images/BON01398 bs mau sua.jpg",
      alt: "Couple sitting on a white classic car under palm trees",
    },
    {
      src: "/images/BON01819 texxt.jpg",
      alt: "Bride and groom holding glasses beside a white classic car",
    },
    {
      src: "/images/BON01585 bs mau suwar.jpg",
      alt: "Bride leaning on a white classic car with groom seated inside",
    },
    {
      src: "/images/BON01879 bs suwa.jpg",
      alt: "Bride and groom embracing by the sea at sunset",
    },
    {
      src: "/images/BON01809 bs mau sua.jpg",
      alt: "Bride and groom standing by the lake under a pink sky",
    },
    {
      src: "/images/BON01951 suwar.jpg",
      alt: "Groom kissing bride on the forehead by the sea",
    },
    {
      src: "/images/BON01763 bs suwar.jpg",
      alt: "Bride and groom posing with a white classic car",
    },
  ],
  location: {
    title: "Nhà hàng tiệc cưới TTC Palace Bến Tre",
    address: "16 Hai Bà Trưng, phường An Hội, tỉnh Vĩnh Long",
    mapUrl: "https://maps.app.goo.gl/fPpj38r4q4XeYBi26",
  },
};
