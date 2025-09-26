"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { memberOperations } from "@/lib/crud-operations"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  message?: string
  details?: string
}

export default function AdminIntegrationTest() {
  const { user } = useAuth()
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const runTests = async () => {
    setTesting(true)
    const testResults: TestResult[] = []

    // Test 1: Authentication
    testResults.push({
      name: "Authentication System",
      status: user ? "success" : "error",
      message: user ? `Logged in as ${user.role}` : "No user authenticated",
      details: user ? `User ID: ${user.id}, Email: ${user.email}` : "Please log in to continue",
    })

    // Test 2: Firebase Connection
    try {
      const startTime = Date.now()
      await memberOperations.list()
      const endTime = Date.now()
      testResults.push({
        name: "Firebase Connection",
        status: "success",
        message: "Successfully connected to Firestore",
        details: `Response time: ${endTime - startTime}ms`,
      })
    } catch (error) {
      testResults.push({
        name: "Firebase Connection",
        status: "error",
        message: "Failed to connect to Firestore",
        details: error instanceof Error ? error.message : "Unknown connection error",
      })
    }

    // Test 3: CRUD Operations
    try {
      const testMember = {
        name: "Test User Integration",
        email: "test-integration@example.com",
        class: "Test Class",
        phone: "1234567890",
        studentId: `TEST${Date.now()}`,
        joinDate: new Date(),
        status: "active" as const,
        ekskulType: "robotik" as const,
      }

      const memberId = await memberOperations.create(testMember)

      // Test read operation
      const readMember = await memberOperations.read(memberId)
      if (!readMember) {
        throw new Error("Failed to read created member")
      }

      // Test update operation
      await memberOperations.update(memberId, { name: "Updated Test User" })

      // Test delete operation
      await memberOperations.delete(memberId)

      testResults.push({
        name: "CRUD Operations",
        status: "success",
        message: "All CRUD operations successful",
        details: "Create, Read, Update, Delete operations completed successfully",
      })
    } catch (error) {
      testResults.push({
        name: "CRUD Operations",
        status: "error",
        message: "CRUD operations failed",
        details: error instanceof Error ? error.message : "Unknown CRUD error",
      })
    }

    // Test 4: Role-based Access
    const validRoles = ["super_admin", "robotik_admin", "silat_admin", "futsal_admin", "band_admin"]
    const hasProperRole = user && validRoles.includes(user.role)
    testResults.push({
      name: "Role-based Access",
      status: hasProperRole ? "success" : "error",
      message: hasProperRole ? `Valid role: ${user?.role}` : "Invalid or missing role",
      details: user ? `Current role: ${user.role}` : "No user role found",
    })

    try {
      const allMembers = await memberOperations.list()
      const validMembers = allMembers.filter(
        (member) => member.name && member.email && member.ekskulType && member.status,
      )

      testResults.push({
        name: "Data Integrity",
        status: validMembers.length === allMembers.length ? "success" : "error",
        message: `${validMembers.length}/${allMembers.length} members have valid data`,
        details: `Total members: ${allMembers.length}, Valid: ${validMembers.length}`,
      })
    } catch (error) {
      testResults.push({
        name: "Data Integrity",
        status: "error",
        message: "Failed to check data integrity",
        details: error instanceof Error ? error.message : "Unknown data integrity error",
      })
    }

    setResults(testResults)
    setTesting(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length
  const totalTests = results.length

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Admin System Integration Test
          {testing && <Loader2 className="w-5 h-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runTests} disabled={testing} className="flex-1">
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Integration Tests
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h4 className="font-medium">{result.name}</h4>
                    {result.message && <p className="text-sm text-muted-foreground">{result.message}</p>}
                    {result.details && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/50 p-2 rounded">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Test Summary</h4>
              <div className="flex gap-4 text-sm mb-2">
                <span className="text-green-600">✓ {successCount} Passed</span>
                <span className="text-red-600">✗ {errorCount} Failed</span>
                <span className="text-muted-foreground">Total: {totalTests}</span>
              </div>
              {totalTests > 0 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(successCount / totalTests) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
