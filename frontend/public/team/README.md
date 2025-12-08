# Team Photos

## Instructions

Place team member photos in this folder and rename them according to the following naming convention:

### Required Photo Names:

1. **bhavya-chawat.jpg** - Bhavya Chawat (Backend Lead & AI Integration Specialist)
2. **vishwaradhya-aiholli.jpg** - Vishwaradhya S Aiholli (Frontend Lead & DevOps Engineer)
3. **shubhang-kuber.jpg** - Shubhang Kuber (Machine Learning Engineer)
4. **kruthi-krishna.jpg** - Kruthi Krishna (ML Research & Planning Lead)
5. **krish-agarwal.jpg** - Krish Agarwal (QA Engineer & Documentation Lead)

### Photo Guidelines:

- **Format**: JPG or PNG (JPG recommended)
- **Size**: Recommended 400x400 pixels (square aspect ratio)
- **File naming**: Use lowercase with hyphens (no spaces)
- **Quality**: Clear, professional headshot or profile picture

### Example:

If you have a photo named `IMG_1234.jpg` for Bhavya, rename it to:

```
bhavya-chawat.jpg
```

### Editing Team Data:

To update team member information (names, roles, social links), edit:

```
frontend/src/data/team.json
```

The JSON structure:

```json
{
  "name": "Full Name",
  "role": "Job Title",
  "avatar": "/team/filename.jpg",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username"
}
```

### Fallback:

If a photo is missing or fails to load, a default user icon will be displayed automatically.
