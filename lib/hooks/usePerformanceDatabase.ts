import { useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { sanitizeFileName } from "@/lib/sanitize"
import type { AudioGroup } from "@/lib/types"

export function usePerformanceDatabase() {
  const savePerformance = useCallback(async (performance: AudioGroup, audioFile?: File) => {
    try {
      let audioPath = ""
      if (audioFile) {
        const timestamp = Date.now()
        const sanitizedFileName = sanitizeFileName(audioFile.name)
        const fileName = `${timestamp}-${sanitizedFileName}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("performance-audio")
          .upload(fileName, audioFile)

        if (uploadError) throw uploadError
        if (uploadData) audioPath = uploadData.path
      }

      const performanceData = {
        id: performance.id,
        name: performance.name,
        audio_path: audioPath,
        duration: performance.duration,
        performance_type: performance.performanceType,
        performance_type_other: performance.performanceTypeOther,
        directions: performance.directions,
        info: performance.info,
        approved: performance.approved ?? false,
        schedule_time: performance.scheduleTime ?? null,
        schedule_order: performance.scheduleOrder ?? null,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("performances")
        .insert([performanceData])

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error saving performance:", error)
      return { success: false, error }
    }
  }, [])

  const getPerformances = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("performances")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error("Error fetching performances:", error)
      return { success: false, error, data: [] }
    }
  }, [])

  const getApprovedPerformances = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("performances")
        .select("*")
        .eq("approved", true)
        .order("schedule_order", { ascending: true })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error("Error fetching approved performances:", error)
      return { success: false, error, data: [] }
    }
  }, [])

  const updatePerformance = useCallback(async (id: string, updates: Partial<AudioGroup>) => {
    try {
      const dbUpdates: Record<string, unknown> = {}
      
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration
      if (updates.directions !== undefined) dbUpdates.directions = updates.directions
      if (updates.info !== undefined) dbUpdates.info = updates.info
      if (updates.performanceType !== undefined) dbUpdates.performance_type = updates.performanceType
      if (updates.performanceTypeOther !== undefined) dbUpdates.performance_type_other = updates.performanceTypeOther
      if (updates.approved !== undefined) dbUpdates.approved = updates.approved
      if (updates.scheduleTime !== undefined) dbUpdates.schedule_time = updates.scheduleTime
      if (updates.scheduleOrder !== undefined) dbUpdates.schedule_order = updates.scheduleOrder

      dbUpdates.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from("performances")
        .update(dbUpdates)
        .eq("id", id)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error updating performance:", error)
      return { success: false, error }
    }
  }, [])

  const approvePerformance = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("performances")
        .update({ approved: true, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error approving performance:", error)
      return { success: false, error }
    }
  }, [])

  const unapprovePerformance = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("performances")
        .update({ approved: false, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error unapproving performance:", error)
      return { success: false, error }
    }
  }, [])

  const deletePerformance = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("performances")
        .delete()
        .eq("id", id)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error deleting performance:", error)
      return { success: false, error }
    }
  }, [])

  return {
    savePerformance,
    getPerformances,
    getApprovedPerformances,
    updatePerformance,
    approvePerformance,
    unapprovePerformance,
    deletePerformance,
  }
}
