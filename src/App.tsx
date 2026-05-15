import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Button from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Sparkles, Copy, Send, Loader2, Wand2 } from "lucide-react"
import { useGenerateScript } from "@/hooks/mutations/useGenerator"
import type { SceneDetail } from "./types/generator"



export default function App() {
  const [platform, setPlatform] = useState("youtube")
  const [tone, setTone] = useState("professional")
  const [topic, setTopic] = useState("")
  const [creativePrompt, setCreativePrompt] = useState("")

  const { mutate, data: result, isPending } = useGenerateScript()

  const handlePlatformChange = (value: string | null) => {
    if (value) {
      setPlatform(value)
    }
  }

  const handleToneChange = (value: string | null) => {
    if (value) {
      setTone(value)
    }
  }

  const handleGenerate = (mode: "guided" | "creative") => {
    const selectedTopic = mode === "guided" ? topic.trim() : creativePrompt.trim()

    if (!selectedTopic) {
      toast("Topic is required", {
        description: "Enter a topic or prompt before generating a script.",
      })
      return
    }

    const payload = mode === "guided"
      ? { mode, platform, tone, topic: selectedTopic } as const
      : { mode, topic: selectedTopic } as const

    mutate(payload, {
      onError: (error) => {
        toast("Generation failed", {
          description: error.message,
        })
      },
    })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast("Copied to clipboard", {
      description: "The content has been copied to your clipboard.",
    })
  }

  const renderResultText = (text: string) => (
    <div className="relative bg-muted/20 border-2 border-dashed border-border/60 rounded-xl p-6 sm:p-8 hover:border-primary/40 hover:bg-muted/30 transition-all duration-300 group">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 h-9 w-9 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
        onClick={() => handleCopy(text)}
        title="Copy to Clipboard"
      >
        <Copy className="h-4 w-4 text-muted-foreground" />
      </Button>
      <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-foreground/90 pr-10 font-medium">
        {text}
      </div>
    </div>
  )

  const formatGuidedData = (data: { title: string; total_duration: string; scenes: SceneDetail[] }) => {
    let result = `[Title]: ${data.title}\n\nTotal Estimated Duration: ${data.total_duration}\n\n`;

    data.scenes.forEach((scene) => {
      result += `SCENE ${scene.scene_number}\n\n`;
      result += `•   Time: ${scene.time_range}\n\n`;
      result += `•   Visual Prompt: ${scene.visual_prompt}\n\n`;
      result += `•   Voiceover: "${scene.voiceover}"\n\n`;
      result += `•   Voice Style: ${scene.voice_style}\n\n`;
    });

    return result.trim();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="flex flex-col items-center mb-10 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-inner">
          <Wand2 className="size-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Script Architect</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Design the perfect narrative for your next big project.
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-3xl space-y-8">
        <Tabs defaultValue="guided" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="guided" className="rounded-lg transition-all data-[state=active]:shadow-sm">Guided Form</TabsTrigger>
            <TabsTrigger value="creative" className="rounded-lg transition-all data-[state=active]:shadow-sm">Creative Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="guided" className="mt-6 focus-visible:outline-none">
            <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="platform" className="text-sm font-medium">Platform</Label>
                    <Select defaultValue="youtube" value={platform} onValueChange={handlePlatformChange}>
                      <SelectTrigger id="platform" className="w-full bg-background transition-colors hover:bg-accent/50">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="tone" className="text-sm font-medium">Tone</Label>
                    <Select defaultValue="professional" value={tone} onValueChange={handleToneChange}>
                      <SelectTrigger id="tone" className="w-full bg-background transition-colors hover:bg-accent/50">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>

                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-sm font-medium">Topic / Key Points</Label>
                  <Textarea
                    id="topic"
                    placeholder="What should the script be about?"
                    className="min-h-[120px] resize-y bg-background transition-colors focus-visible:ring-primary/50"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                  />
                </div>

                <Button
                  onClick={() => handleGenerate("guided")}
                  disabled={isPending}
                  className="w-full group transition-all duration-300 relative overflow-hidden"
                  size="lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  )}
                  {isPending ? "Generating..." : "Generate Script"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creative" className="mt-6 focus-visible:outline-none">
            <div className="relative group rounded-xl shadow-sm border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-300 hover:shadow-md">
              <Textarea
                className="min-h-[250px] resize-none border-0 focus-visible:ring-0 rounded-xl bg-transparent p-5 pb-16 text-base"
                placeholder="Write a script for..."
                value={creativePrompt}
                onChange={(event) => setCreativePrompt(event.target.value)}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={() => handleGenerate("creative")}
                  disabled={isPending}
                  className="rounded-full h-11 w-11 shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Output Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out pt-4">
            <div className="flex items-center gap-4 mb-4 opacity-70">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Result</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {result.mode === "creative" ? renderResultText(result.script) : renderResultText(formatGuidedData(result))}
          </div>
        )}
      </main>
    </div>
  )
}
