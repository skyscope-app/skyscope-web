"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useScopedI18n } from "@/locales/client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"

const joinFormSchema = z.object({
  username: z.string().min(3),
  fullName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
})

export function JoinForm() {
  const t = useScopedI18n('auth.join');

  const form = useForm<z.infer<typeof joinFormSchema>>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof joinFormSchema>) {
    // TODO: Implement.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("username")}
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("fullName")}
                    autoComplete="name"
                    autoCapitalize="none"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("email")}
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("password")}
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit">{t('joinWaitList')}</Button>
          <span className="text-xs text-muted-foreground">
            {t('agreeToTerms')} {' '}
            <Link href="/tos" className="transition-colors hover:text-accent-foreground duration-150 underline decoration-background hover:decoration-current underline-offset-2">{t('terms')}</Link>
            {' '} {t('and')} {' '}
            <Link href="/privacy" className="transition-colors hover:text-accent-foreground duration-150 underline decoration-background hover:decoration-current underline-offset-2">{t('privacy')}</Link>
          </span>
        </div>
      </form>
    </Form>
  )
}