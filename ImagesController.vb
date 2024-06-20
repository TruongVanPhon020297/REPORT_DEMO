Imports System.Data.SqlClient
Imports System.Net
Imports System.Net.Http
Imports System.Web.Http
Imports Newtonsoft.Json

Public Class ImagesController
    Inherits ApiController

    ' POST: api/Images
    <HttpPost>
    Public Function Post(<FromBody> imagesInfo As List(Of ImageInfo)) As HttpResponseMessage
        Try
            For i = 0 To imagesInfo.Count

                Dim images As Byte() = GetImageData(imagesInfo(i).dataURL)

                imagesInfo(i).dataURL = ""

                Dim json As String = JsonConvert.SerializeObject(imagesInfo(i))

                SaveImage(images, json)

            Next


            Return Request.CreateResponse(HttpStatusCode.OK, "Images info saved successfully")
        Catch ex As Exception
            Return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message)
        End Try
    End Function

    Private Function GetImageData(imagePath As String) As Byte()
        Dim base64Data As String = imagePath.Replace("data:image/png;base64,", "")
        Dim binaryData As Byte() = Convert.FromBase64String(base64Data)
        Return binaryData
    End Function

    Public Sub SaveImage(image As Byte(), imageInfo As String)
        Using connection As New SqlConnection("Data Source=DESKTOP-SPMPBPE;Initial Catalog=DB_MVC_VB_Net;Integrated Security=True")
            Dim query As String = "INSERT INTO image_data (image, image_info) VALUES (@Image, @ImageInfo)"
            Dim command As New SqlCommand(query, connection)
            command.Parameters.AddWithValue("@Image", image)
            command.Parameters.AddWithValue("@ImageInfo", imageInfo)

            connection.Open()
            command.ExecuteNonQuery()
        End Using
    End Sub

    Public Class ImageInfo
        Public Property page As Integer
        Public Property dataURL As String
        Public Property top As Integer

        Public Property left As Integer
    End Class
End Class
