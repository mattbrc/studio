import { BiWorld, BiSolidDashboard } from "react-icons/bi";
import { BsDiscord, BsStrava } from "react-icons/bs";
import { BsFillFileEarmarkSpreadsheetFill, BsTwitterX } from "react-icons/bs";
import { IoMdNutrition } from "react-icons/io";
import {
  MdOutlineTrackChanges,
  MdOutlinePayment,
  MdOutlineExplore,
} from "react-icons/md";
import { FaArrowDown, FaInstagram } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { LuLoader2 } from "react-icons/lu";
import { RiMenuFill } from "react-icons/ri";
import { FaBookmark } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";
import { GoCheckCircle } from "react-icons/go";
import { GrCircleAlert } from "react-icons/gr";

export const Icons = {
  discord: BsDiscord,
  strava: BsStrava,
  programming: BsFillFileEarmarkSpreadsheetFill,
  tracking: MdOutlineTrackChanges,
  nutrition: IoMdNutrition,
  wod: BiWorld,
  billing: MdOutlinePayment,
  settings: FiSettings,
  user: AiOutlineUser,
  dashboard: BiSolidDashboard,
  explore: MdOutlineExplore,
  spinner: LuLoader2,
  instagram: FaInstagram,
  x: BsTwitterX,
  menu: RiMenuFill,
  bookmark: FaBookmark,
  warning: IoWarning,
  arrow: IoIosArrowDown,
  subscribeArrow: IoArrowForward,
  check: GoCheckCircle,
  alert: GrCircleAlert,
};
