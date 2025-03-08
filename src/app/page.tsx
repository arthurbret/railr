"use client";

import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  // Use client-side only rendering for components with animations
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-40 md:px-12 bg-gradient-to-b from-background to-muted">
          <div className="container w-full max-w-none px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  {isClient ? (
                    <motion.h1
                      className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Ne ratez plus jamais votre train
                    </motion.h1>
                  ) : (
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Ne ratez plus jamais votre train
                    </h1>
                  )}

                  {isClient ? (
                    <motion.p
                      className="max-w-[600px] text-muted-foreground md:text-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      Railr fournit des informations en temps réel sur les
                      trains SNCF, y compris les retards et les modifications de
                      trajet, pour vos gares préférées.
                    </motion.p>
                  ) : (
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Railr fournit des informations en temps réel sur les
                      trains SNCF, y compris les retards et les modifications de
                      trajet, pour vos gares préférées.
                    </p>
                  )}
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button size="lg" className="gap-1">
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </motion.div>
              </div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative h-[350px] w-full max-w-[500px] overflow-hidden rounded-xl border bg-background shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background p-6">
                    <div className="space-y-2 rounded-lg bg-background/90 backdrop-blur p-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Paris Gare de Lyon</h3>
                        <Heart
                          className="h-5 w-5 text-primary"
                          fill="currentColor"
                        />
                      </div>
                      <div className="space-y-3 pt-2">
                        {[
                          {
                            time: "14:32",
                            destination: "Lyon Part-Dieu",
                            platform: "5",
                            status: "On time",
                          },
                          {
                            time: "14:45",
                            destination: "Marseille St Charles",
                            platform: "7",
                            status: "Delayed +10min",
                            delayed: true,
                          },
                          {
                            time: "15:02",
                            destination: "Dijon Ville",
                            platform: "3",
                            status: "On time",
                          },
                        ].map((train, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg bg-muted p-2"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-bold">
                                {train.time}
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {train.destination}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Quai {train.platform}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`text-xs font-medium ${
                                train.delayed
                                  ? "text-destructive"
                                  : "text-primary"
                              }`}
                            >
                              {train.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 w-full max-w-none">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Fonctionnalités principales
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Tout ce dont vous avez besoin pour voyager en train
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Railr rend votre expérience de voyage en train SNCF plus
                  fluide avec des mises à jour en temps réel et des informations
                  personnalisées.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <Clock className="h-10 w-10 text-primary" />,
                  title: "Informations en temps réel",
                  description:
                    "Trouvez des informations en temps réel sur les horaires des trains, les quais et les retards potentiels pour n'importe quelle gare SNCF.",
                },
                {
                  icon: <Heart className="h-10 w-10 text-primary" />,
                  title: "Gares favorites",
                  description:
                    "Enregistrez vos gares les plus fréquentées pour un accès rapide aux mises à jour en temps réel et aux informations sur les services.",
                },
                {
                  icon: <Bell className="h-10 w-10 text-muted-foreground" />,
                  title: (
                    <div className="flex items-center gap-2">
                      <span>Notifications</span>
                      <span className="inline-flex items-center rounded-full border border-dashed border-primary/70 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Bientôt disponible
                      </span>
                    </div>
                  ),
                  description:
                    "Recevez des alertes sur les perturbations affectant vos gares favorites directement sur votre appareil.",
                  comingSoon: true,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col items-center space-y-4 rounded-lg border ${
                    feature.comingSoon
                      ? "border-dashed border-muted-foreground/50 bg-muted/30"
                      : "border-solid bg-background"
                  } p-6 shadow-sm`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`rounded-full ${
                      feature.comingSoon ? "bg-muted/50" : "bg-primary/10"
                    } p-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p
                    className={`text-center ${
                      feature.comingSoon
                        ? "text-muted-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 w-full max-w-none">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Comment utiliser Railr
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple, intuitif et conçu pour les usagers quotidiens de
                  trains SNCF.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Cherchez votre gare</h3>
                  <p className="text-muted-foreground">
                    Entrez le nom de n&apos;importe quelle gare SNCF pour voir
                    les trains à venir, les quais et les mises à jour en temps
                    réel.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Ajoutez vos favoris</h3>
                  <p className="text-muted-foreground">
                    Enregistrez vos gares les plus fréquentées trouvez ses
                    informations en 1 clic.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Restez informés</h3>
                  <p className="text-muted-foreground">
                    Recevez des mises à jour en temps réel sur les retards, les
                    changements de quai et les modifications de service pour vos
                    trains.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative h-[400px] w-full overflow-hidden rounded-xl border bg-background shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-destructive"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>

                    <div className="rounded-lg bg-background/90 backdrop-blur p-4 shadow-lg">
                      <div className="mb-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search for a station..."
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            defaultValue="Paris"
                          />
                          <div className="absolute right-3 top-2">
                            <svg
                              className="h-4 w-4 text-muted-foreground"
                              fill="none"
                              height="24"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="11" cy="11" r="8" />
                              <path d="m21 21-4.3-4.3" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-lg bg-muted p-3 hover:bg-muted/80 cursor-pointer">
                          <div>Paris Gare de Lyon</div>
                          <Heart className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted p-3 hover:bg-muted/80 cursor-pointer">
                          <div>Paris Gare du Nord</div>
                          <Heart className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted p-3 hover:bg-muted/80 cursor-pointer">
                          <div>Paris Montparnasse</div>
                          <Heart className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted p-3 hover:bg-muted/80 cursor-pointer">
                          <div>Paris Saint-Lazare</div>
                          <Heart className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 md:px-12 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 w-full max-w-none">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Prêt à simplifier vos voyages en train ?
                  </h2>
                  <p className="text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Rejoignez des centaines de voyageurs SNCF qui utilisent déjà
                    Railr au quotidien.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" variant="secondary" className="gap-1">
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center lg:justify-end"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex aspect-square items-center justify-center rounded-lg bg-primary-foreground/10 p-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
                        <Image
                          src={`/avatars/avatar-${i + 1}.png?w=60&h=60`}
                          width={55}
                          height={55}
                          alt="User avatar"
                          className=""
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 w-full max-w-none">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Questions fréquemment posées
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tout ce que vous devez savoir sur Railr.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-4 py-12">
              {[
                {
                  question: "Est-ce que Railr est gratuit ?",
                  answer:
                    "Oui, Railr est entièrement gratuit pour tous les utilisateurs. Nous croyons en la mise à disposition des informations de voyage en train à tout le monde.",
                },
                {
                  question: "Quelles gares SNCF sont prises en charge ?",
                  answer:
                    "Railr prend en charge toutes les gares SNCF en France, y compris les gares TGV, TER, Intercités et les services locaux.",
                },
                {
                  question: "A quel point les informations en temps réel sont-elles précises ?",
                  answer:
                    "Nos données proviennent directement de la SNCF, garantissant les informations les plus récentes et précises disponibles. Malgré tout, dans de très rares cas, des erreurs peuvent survenir.",
                },
                {
                  question: "Quand est-ce que les notifications seront disponibles ?",
                  answer:
                    "Les notifications de perturbations sont une de nos priorités actuellement mais nous n'avons pas encore de date de lancement. Restez à l'écoute pour les mises à jour !",
                },
                {
                  question: "Est-ce que je dois créer un compte ?",
                  answer:
                    "Non ! Nous pensons l'ensemble de nos fonctionnalités pour être accessibles sans compte."
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg border p-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-bold">{item.question}</h3>
                  <p className="mt-2 text-muted-foreground">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
