import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 overflow-hidden">
      <section className="mx-auto max-w-[1024px] px-4">
        SDG ที่ใช้
      </section>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

    </main>
  )
}
export default AboutPage