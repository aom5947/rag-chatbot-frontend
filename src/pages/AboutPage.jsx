import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Scale } from "lucide-react"
import { TypeAnimation } from "react-type-animation"

const sdgData = [
  {
    id: 11,
    title: "Sustainable Cities and Communities",
    titleTh: "เมืองและชุมชนที่ยั่งยืน",
    description: "ช่วยส่งเสริมความปลอดภัยบนท้องถนน และสร้างสังคมที่มีระเบียบ",
    color: "bg-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-700",
    icon: Building2,
  },
  {
    id: 16,
    title: "Peace, Justice and Strong Institutions",
    titleTh: "สันติภาพ ความยุติธรรม และสถาบันที่เข้มแข็ง",
    description: "ช่วยส่งเสริมความรู้ด้านกฎหมาย และเพิ่มการเข้าถึงข้อมูลทางกฎหมายของประชาชน",
    color: "bg-blue-700",
    textColor: "text-blue-700",
    borderColor: "border-blue-700",
    icon: Scale,
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            <TypeAnimation
              sequence={[
                'SDG Mapping',
                4000,
                'Sustainable Development Goals',
                2000,
                'เป้าหมายการพัฒนาที่ยั่งยืน',
                2000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sustainable Development Goals ที่โครงการนี้มีส่วนช่วยสนับสนุน
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sdgData.map((sdg) => {
            const Icon = sdg.icon
            return (
              <Card
                key={sdg.id}
                className={`rounded-xl overflow-hidden border hover:${sdg.borderColor} transition-all hover:shadow-md`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-md ${sdg.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <Badge className={`${sdg.color} text-white`}>
                        SDG {sdg.id}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="mt-3 text-lg">
                    {sdg.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {sdg.titleTh}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sdg.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
